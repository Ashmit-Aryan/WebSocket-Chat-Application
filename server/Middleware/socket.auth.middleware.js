import User from '../Model/User.js';
import {verifyToken} from '../lib/jwt.js';

export const socketAuthMiddleware = async (socket, next) => {

    try {
        
    const token = socket.handshake.headers.cookie?.split("; ")?.find(row => row.startsWith("token="))?.split("=")[1];
    console.log("Socket authentication attempt, token found:", socket);
    if(!token) {
        console.log("Socket authentication failed: No token provided");
        return next(new Error("Authentication error: No token provided"));
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        console.log("Socket authentication failed: Invalid token");
        return next(new Error("Authentication error: Invalid token"));
    }
     const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        console.log("Socket authentication failed: User not found");
        return next(new Error("Authentication error: User not found"));
    }
    socket.user = user;
    socket.userId = user._id.toString();
    console.log(`Socket authenticated successfully for user: ${user.username}, userId: ${user._id}, socketId: ${socket.id}, fullname: ${user.fullName}`);
    next();
    } catch (error) {
        console.log("Socket authentication error:", error);
        return next(new Error("Authentication error: Internal server error"));
    }
    
}