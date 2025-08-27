// app/api/distributors/route.js

import dbConnect from "@/lib/dbConnect";
import Distributor from "@/models/Distributor"; // ✅ singular and correct model import
import {
  successResponse,
  createdResponse,
  errorResponse,
  conflictResponse,
  notFoundResponse,
} from "@/lib/apiResponse"; // ✅ added notFoundResponse (used but missing in original)

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const query = url.searchParams.get("q")?.trim();

    // Search by registrationNumber, cnicNumber or contactNumber
    if (query) {
      const distributor = await Distributor.findOne({
        $or: [
          { registrationNumber: query },
          { cnicNumber: query },
          { contactNumber: query },
        ],
      }).lean();

      if (!distributor) return notFoundResponse("Distributor not found");

      return successResponse(distributor, "Distributor fetched");
    }

    // Default: paginated result
    const [total, data] = await Promise.all([
      Distributor.countDocuments(),
      Distributor.find().skip(skip).limit(limit).lean(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse({ data, totalPages }, "Fetched distributors");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { cnicNumber } = body;

 

    // Check for duplicate CNIC
    const existingDistributor = await Distributor.findOne({ cnicNumber });
    if (existingDistributor) {
      return conflictResponse("A distributor with this CNIC number already exists.");
    }

    const distributor = await Distributor.create(body);
    return createdResponse(distributor, "Distributor registered successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
