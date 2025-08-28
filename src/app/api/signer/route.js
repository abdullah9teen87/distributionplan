import dbConnect from "@/lib/dbConnect";
import Signer from "@/models/Signer";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  methodNotAllowedResponse,
} from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);

    // Pagination params
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Optional search query (search by name or email)
    const query = url.searchParams.get("q")?.trim();

    let filter = {};
    if (query) {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      };
    }

    // Count total documents and fetch paginated results
    const [total, data] = await Promise.all([
      Signer.countDocuments(filter),
      Signer.find(filter)
        .select("-password") // exclude password
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    if (!data.length) return notFoundResponse("No signers found");

    const totalPages = Math.ceil(total / limit);

    return successResponse({ data, totalPages, page, limit }, "Signers fetched successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(err, 500);
  }
}

// Block unsupported methods
export function POST() {
  return methodNotAllowedResponse();
}

export function PUT() {
  return methodNotAllowedResponse();
}

export function DELETE() {
  return methodNotAllowedResponse();
}
