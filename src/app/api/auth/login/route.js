import dbConnect from "@/lib/dbConnect";
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
    const { identifier, password } = await req.json();
    console.log("Login attempt with:", { identifier, password });
    if (!identifier || !password) {
      return errorResponse(
        "Email or Mobile Number and Password are required",
        422
      );
    }

    // User check
    const user = await Signer.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Verify email
    if (!user.isVerified) {
      return errorResponse("Please verify your email before login", 403);
    }
    console.log("Found user:", user);
    // Verify email
    if (!user.isAdminApprove) {
      return errorResponse(
        "Please wait or contact admin will be approved you credentials",
        403
      );
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
        role: user.role,
      },
      "Login successful 🎉"
    );
  } catch (error) {
    console.error("Login error:", error);
    return serverErrorResponse(error.message || "Login failed ❌");
  }
}
