import dbConnect from "@/lib/dbConnect";
import Signer from "@/models/Signer";
import LoginHistory from "@/models/LoginHistory";
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


    const ip =
      req.headers.get("x-forwarded-for") || "unknown"; // client IP
    const userAgent = req.headers.get("user-agent") || "unknown";


    if (!identifier || !password) {
      return errorResponse(
        "Email or Mobile Number and Password are required",
        422
      );
    }
    console.log("req", req)


  
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






    if (!user) {
      // log failed attempt
      await LoginHistory.create({
        identifier,
        status: "failed",
        ip,
        userAgent,
      });
      return errorResponse("User not found", 404);
    }

    if (!user.isVerified) {
      await LoginHistory.create({
        user: user._id,
        identifier,
        status: "failed",
        ip,
        userAgent,
      });
      return errorResponse("Please verify your email before login", 403);
    }

    if (!user.isAdminApprove) {
      await LoginHistory.create({
        user: user._id,
        identifier,
        status: "failed",
        ip,
        userAgent,
      });
      return errorResponse(
        "Please wait or contact admin will be approved you credentials",
        403
      );
    }








    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       await LoginHistory.create({
        user: user._id,
        identifier,
        status: "failed",
        ip,
        userAgent,
      });
      return errorResponse("Invalid credentials", 401);
    }

  // ✅ Success login → save history
      await LoginHistory.create({
      user: user._id,
      identifier,
      status: "success",
      ip,
      userAgent,
    });


    // Success response
    return successResponse(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      "Login successful 🎉"
    );
  } catch (error) {
    console.error("Login error:", error);
    return serverErrorResponse(error.message || "Login failed ❌");
  }
}
