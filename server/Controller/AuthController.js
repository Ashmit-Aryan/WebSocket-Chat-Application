import User from "../Model/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt.js";
import { sendWelcomeEmail } from "../lib/Email/emailHandler.js";
import cloudinary from "../lib/cloudinary.js";
import * as dotenv from "dotenv";
dotenv.config();

export async function signup(req, res) {
  const { fullName, username, email, password, profilePicture } = req.body;

  // Basic validation
  if (!username || !email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = new User({
    fullName,
    username,
    email,
    password: hashedPassword,
    profilePicture: profilePicture || "",
  });

  try {
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      await sendWelcomeEmail(newUser.email, newUser.fullName, process.env.CLIENT_URL);
      return res
        .status(201)
        .json({
          message: "User registered successfully",
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profilePicture: newUser.profilePicture
        });
    } else {
      return res.status(500).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function login(req, res) {

    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "user does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        generateToken(user._id, res);
        return res.json({
            message: "Login successful",
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server error" });
    }

}

export async function logout(req, res) {
  res.cookie("token", "", {
    maxAge: 0
  });
  res.json({ message: "Logged out successfully" });
}


export async function updateProfile(req, res) {
  try {
    const profilePicture = req.body;
    if(!profilePicture){
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
      folder: "profile_pictures",
      public_id: `${userId}_profile_picture`,
      overwrite: true,
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    );
    res.json({
      updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  } 
}