import dbConnect from "@/lib/dbConnect"; // Mongoose connection helper
import Signer from "@/models/Signer";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
  methodNotAllowedResponse,
} from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return errorResponse("Signer ID is required", 400);
    }

    await dbConnect(); // Connect to MongoDB

    const signer = await Signer.findById(id).select("-password"); // Exclude password

    if (!signer) {
      return notFoundResponse("Signer not found");
    }

    return successResponse(signer, "Signer fetched successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(err, 500);
  }
}

// Optional: Handle unsupported methods
export function POST() {
  return methodNotAllowedResponse();
}

export function PUT() {
  return methodNotAllowedResponse();
}

export function DELETE() {
  return methodNotAllowedResponse();
}
