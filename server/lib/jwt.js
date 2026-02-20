import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
export const generateToken = (userId,res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 hour
        sameSite: "strict"
    });
    return token;
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};
