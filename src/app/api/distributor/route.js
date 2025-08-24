// app/api/users/route.js

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import {
  successResponse,
  createdResponse,
  errorResponse,
  conflictResponse,
  methodNotAllowedResponse,
} from "@/lib/apiResponse";

// GET all users
// export async function GET(req) {
//   try {
//     await dbConnect();
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);
//     const skip = (page - 1) * limit;

//     const [total, data] = await Promise.all([
//       User.countDocuments(),
//       User.find().skip(skip).limit(limit).lean(),
//     ]);

//     const totalPages = Math.ceil(total / limit);
//     return successResponse(Response, { data, totalPages }, "Fetched users");
//   } catch (err) {
//     return errorResponse(Response, err);
//   }
// }


export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const query = url.searchParams.get("q")?.trim();

    // If there's a query string, search by registrationNumber, cnicNumber or contactNumber
    if (query) {
      const user = await User.findOne({
        $or: [
          { registrationNumber: query },
          { cnicNumber: query },
          { contactNumber: query },
        ],
      }).lean();

      if (!user) return notFoundResponse("User not found");

      return successResponse(user, "User fetched");
    }

    // Default: paginated result
    const [total, data] = await Promise.all([
      User.countDocuments(),
      User.find().skip(skip).limit(limit).lean(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      { data, totalPages },
      "Fetched users"
    );
  } catch (err) {
    return errorResponse(err);
  }
}



// POST a new user
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { cnicNumber } = body;

    // Check for duplicate CNIC
    const existingUser = await User.findOne({ cnicNumber });
    if (existingUser) {
      return conflictResponse(Response, "A user with this CNIC number already exists.");
    }

    const user = await User.create(body);
    return createdResponse(Response, user, "User registered successfully");
  } catch (error) {
    return errorResponse(Response, error);
  }
}
