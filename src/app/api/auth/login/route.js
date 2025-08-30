// import dbConnect from "@/lib/dbConnect";
// import Signer from "@/models/Signer";
// import LoginHistory from "@/models/LoginHistory";
// import bcrypt from "bcryptjs";
// import {
//   successResponse,
//   errorResponse,
//   serverErrorResponse,
// } from "@/lib/apiResponse";

// export async function POST(req) {
//   await dbConnect();

//   try {
//     const { identifier, password } = await req.json();
//     console.log("Login attempt with:", { identifier, password });

//     const ip =
//       req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // proxy IP chain
//       req.headers.get("x-real-ip") || // some hosts send this
//       req.socket?.remoteAddress ||
//       "unknown";

//     const userAgent = req.headers.get("user-agent") || "unknown";

//     if (!identifier || !password) {
//       return errorResponse(
//         "Email or Mobile Number and Password are required",
//         422
//       );
//     }
//     console.log("req", req);

//     // User check
//     const user = await Signer.findOne({
//       $or: [{ email: identifier }, { mobile: identifier }],
//     });

//     if (!user) {
//       return errorResponse("User not found", 404);
//     }

//     // Verify email
//     if (!user.isVerified) {
//       return errorResponse("Please verify your email before login", 403);
//     }
//     console.log("Found user:", user);
//     // Verify email
//     if (!user.isAdminApprove) {
//       return errorResponse(
//         "Please wait or contact admin will be approved you credentials",
//         403
//       );
//     }

//     if (!user) {
//       // log failed attempt
//       await LoginHistory.create({
//         identifier,
//         status: "failed",
//         ip,
//         userAgent,
//       });
//       return errorResponse("User not found", 404);
//     }

//     if (!user.isVerified) {
//       await LoginHistory.create({
//         user: user._id,
//         identifier,
//         status: "failed",
//         ip,
//         userAgent,
//       });
//       return errorResponse("Please verify your email before login", 403);
//     }

//     if (!user.isAdminApprove) {
//       await LoginHistory.create({
//         user: user._id,
//         identifier,
//         status: "failed",
//         ip,
//         userAgent,
//       });
//       return errorResponse(
//         "Please wait or contact admin will be approved you credentials",
//         403
//       );
//     }

//     // Password check
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       await LoginHistory.create({
//         user: user._id,
//         identifier,
//         status: "failed",
//         ip,
//         userAgent,
//       });
//       return errorResponse("Invalid credentials", 401);
//     }

//     // ✅ Success login → save history
//     await LoginHistory.create({
//       user: user._id,
//       identifier,
//       status: "success",
//       ip,
//       userAgent,
//     });

//     // Success response
//     return successResponse(
//       {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         mobile: user.mobile,
//         role: user.role,
//       },
//       "Login successful 🎉"
//     );
//   } catch (error) {
//     console.error("Login error:", error);
//     return serverErrorResponse(error.message || "Login failed ❌");
//   }
// }




import dbConnect from "@/lib/dbConnect";
import Signer from "@/models/Signer";
import LoginHistory from "@/models/LoginHistory";
import bcrypt from "bcryptjs";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/apiResponse";

// Simple IP → Location fetcher
async function getGeoInfo(ip) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) return {};
    const data = await res.json();
    return {
      city: data.city || null,
      region: data.region || null,
      country: data.country_name || null,
    };
  } catch (err) {
    console.error("Geo lookup error:", err);
    return {};
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { identifier, password, latitude, longitude } = await req.json();
    console.log("Login attempt with:", { identifier, latitude, longitude });

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // proxy IP chain
      req.headers.get("x-real-ip") || // some hosts send this
      req.socket?.remoteAddress ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    if (!identifier || !password) {
      return errorResponse(
        "Email or Mobile Number and Password are required",
        422
      );
    }

    // Get city/region/country from IP
    const geoInfo = await getGeoInfo(ip);

    // User check
    const user = await Signer.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) {
      await LoginHistory.create({
        identifier,
        status: "failed",
        ip,
        userAgent,
        latitude,
        longitude,
        ...geoInfo,
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
        latitude,
        longitude,
        ...geoInfo,
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
        latitude,
        longitude,
        ...geoInfo,
      });
      return errorResponse(
        "Please wait or contact admin will be approved your credentials",
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
        latitude,
        longitude,
        ...geoInfo,
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
      latitude,
      longitude,
      ...geoInfo,
    });

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
