// import nodemailer from "nodemailer";
// import Otp from "@/models/Otp";
// import {
//   successResponse,
//   errorResponse,
//   serverErrorResponse,
//   conflictResponse
// } from "@/lib/apiResponse";
// import dbConnect from "@/lib/dbConnect";
// import Signer from "@/models/Signer";

// export async function POST(req) {
//   await dbConnect();

//   try {
//     const { name, email } = await req.json();

//     if (!email) {
//       return errorResponse("Email is required", 422);
//     }

//     // Check if user already exists
//     const existing = await Signer.findOne({ email });
//     if (existing) {
//       return conflictResponse("User already exists");
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Save OTP in DB (purana delete karke naya save)
//     await Otp.deleteMany({ email });
//     await Otp.create({ email, otp });

//     // Send OTP via email
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: process.env.EMAIL_PORT == 465,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Distribution Plan System" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔐 Verify your email - OTP Code",
//       text: `Your OTP is: ${otp}`, // fallback for text-only clients
//       html: `
//     <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
//       <h2 style="color: #2563eb; text-align: center;">Email Verification</h2>
//       <p style="font-size: 15px; color: #333;">
//         Hi <b>${name || "User"}</b>,
//       </p>
//       <p style="font-size: 15px; color: #333;">
//         Thank you for registering. Please use the following OTP code to verify your email:
//       </p>
//       <div style="text-align: center; margin: 20px 0;">
//         <span style="font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #2563eb;">
//           ${otp}
//         </span>
//       </div>
//       <p style="font-size: 14px; color: #555;">
//         This OTP will expire in <b>10 minutes</b>. Please do not share it with anyone.
//       </p>
//       <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
//       <p style="font-size: 12px; color: #888; text-align: center;">
//         If you did not request this, please ignore this email.
//       </p>
//     </div>
//   `,
//     });

//     return successResponse(null, "OTP sent to email");
//   } catch (error) {
//     console.error("Error in OTP send:", error);
//     return serverErrorResponse(error.message || "Failed to send OTP");
//   }
// }


import dbConnect from "@/lib/dbConnect";
import Signer from "@/models/Signer";
import Otp from "@/models/Otp";
import nodemailer from "nodemailer";
import {
  successResponse,
  errorResponse,
  conflictResponse,
  serverErrorResponse,
} from "@/lib/apiResponse";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, password } = await req.json();

    if (!email) {
      return errorResponse("Email is required", 422);
    }

    // ✅ Check if user already exists
    const existing = await Signer.findOne({ email });
    if (existing) {
      return conflictResponse("User already exists");
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save OTP in DB (purana delete karke naya save)
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    // ✅ Send OTP via email
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
      subject: "🔐 Verify your email - OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
          <h2 style="color: #2563eb; text-align: center;">Email Verification</h2>
          <p>Hi <b>${name || "User"}</b>,</p>
          <p>Please use the following OTP code to verify your email:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #2563eb;">
              ${otp}
            </span>
          </div>
          <p>This OTP will expire in <b>10 minutes</b>. Do not share it with anyone.</p>
        </div>
      `,
    });

    return successResponse(null, "OTP sent to email");
  } catch (error) {
    console.error("Signup Error:", error);
    return serverErrorResponse(error.message || "Failed to send OTP");
  }
}
