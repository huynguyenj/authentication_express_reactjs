import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from 'crypto' 
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../libs/mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });
    console.log(userAlreadyExists);
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already existed" });
    }
    const hashedPassword = await bcryptjs.hash(password, 11);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpired: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await user.save();
    //jwt
    generateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);
    res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpired: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired verify token" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpired = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in verify email", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        user: { ...user._doc, password: undefined },
      });
  } catch (error) {
      console.log("Login fail",error);
      res.status(400).json({success:false, message:error.message});
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
export const forgotPassword = async (req,res) => {
      const {email} = req.body;
      try {
            const user = await User.findOne({email});
            if(!user){
                  return res.status(400).status({success:false, message:"Invalid email"});
            }
            const resetToken = crypto.randomBytes(20).toString("hex");
            const resetTokenExpired = Date.now() + 1 * 60 * 60 * 1000;
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpiredAt = resetTokenExpired;
            await user.save();
            await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
            res.status(200).json({success:true, message:"Password reset link sent to your email"})
      } catch (error) {
            console.log("Error in forgot password",error);
            res.status(400).json({success:false,message:error.message});
      }
}

export const resetPassword = async (req,res) => {
      try {
            const {token} = req.params;
            const {password} =req.body;
            const user = await User.findOne({
                  resetPasswordToken: token,
                  resetPasswordExpiredAt: {$gt: Date.now()}
            })
            if(!user){
            res.status(400).json({success:false,message:"Invalid or expired reset token"});
            }
            const hashedPassword = await bcryptjs.hash(password,11);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpiredAt = undefined;
            await user.save();
            await sendResetSuccessEmail(user.email);
            res.status(200).json({success:true, message:"Password is reset successfully!"})
      } catch (error) {
            console.log("Error in forgot password",error);
            res.status(400).json({success:false,message:error.message});
      }
}

export const checkAuth = async (req,res) => {
      try {
            const user = await User.findById(req.userId).select("-password");
            if(!user){
                  return res.status(400).json({success:false,message:"User not found"});
            }
            res.status(200).json({success:true,user});
      } catch (error) {
            console.log("Error in checkAuth", error);
            res.status(400).json({success:false,message:error.message})
      }
}