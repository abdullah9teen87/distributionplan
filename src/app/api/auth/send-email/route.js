import nodemailer from "nodemailer";
import Otp from "@/models/Otp";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, mobile, type = "verify-email" } = await req.json();

    if (!email) {
      return errorResponse("Email is required", 422);
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB (purana delete karke naya save)
    await Otp.deleteMany({ email });
    await Otp.create({ email, mobile, otp });

    // Email content based on type
    let subject = "";
    let message = "";

    if (type === "verify-email") {
      subject = "🔐 Verify your email - OTP Code";
      message = `
        <h2 style="color: #2563eb; text-align: center;">Email Verification</h2>
        <p>Hi <b>${name || "User"}</b>,</p>
        <p>Please use the following OTP to verify your email:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #2563eb;">${otp}</span>
        </div>
        <p>This OTP will expire in <b>10 minutes</b>. Please do not share it.</p>
      `;
    } else if (type === "forgot-password") {
      subject = "🔑 Password Reset Request";
      message = `
        <h2 style="color: #dc2626; text-align: center;">Reset Your Password</h2>
        <p>Hi <b>${name || "User"}</b>,</p>
        <p>You requested to reset your password. Use the following OTP:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #dc2626;">${otp}</span>
        </div>
        <p>This OTP will expire in <b>10 minutes</b>. If you didn’t request this, please ignore this email.</p>
      `;
    } else {
      return errorResponse("Invalid email type", 400);
    }

    // Send Email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Distribution Plan System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          ${message}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888; text-align: center;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    });

    return successResponse(null, "OTP sent to email");
  } catch (error) {
    console.error("Error in OTP send:", error);
    return serverErrorResponse(error.message || "Failed to send OTP");
  }
}
