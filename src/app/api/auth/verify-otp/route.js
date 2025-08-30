import dbConnect from "@/lib/dbConnect";
import Otp from "@/models/Otp";
import Signer from "@/models/Signer";
import bcrypt from "bcryptjs";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/apiResponse";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, mobile, password, otp } = await req.json();

    if (!email || !otp) {
      return errorResponse("Email and OTP are required", 422);
    }

    // Check OTP
    const otpDoc = await Otp.findOne({ email, mobile, otp });
    if (!otpDoc) {
      return errorResponse("Invalid or expired OTP", 400);
    }

    // ✅ OTP mil gaya, ab delete kar do
    await Otp.deleteMany({ email });

    // ✅ Password hash karo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ User create karo
    const user = await Signer.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      isVerified: true,
    });

    return successResponse(user, "User registered successfully");
  } catch (error) {
    console.error("Error in OTP verification:", error);
    return serverErrorResponse(error.message || "Failed to verify OTP");
  }
}
