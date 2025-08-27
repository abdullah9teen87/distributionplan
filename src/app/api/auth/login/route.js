import dbConnect from "@/lib/dbConnect";
import Signer from "@/models/Signer";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse, serverErrorResponse } from "@/lib/apiResponse";

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return errorResponse("Email and Password are required", 422);
    }

    // User check
    const user = await Signer.findOne({ email });
    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Verify email
    if (!user.isVerified) {
      return errorResponse("Please verify your email before login", 403);
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse("Invalid credentials", 401);
    }

    // Success response
    return successResponse(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "Login successful 🎉"
    );
  } catch (error) {
    console.error("Login error:", error);
    return serverErrorResponse(error.message || "Login failed ❌");
  }
}
