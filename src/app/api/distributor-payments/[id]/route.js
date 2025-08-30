import dbConnect from "@/lib/dbConnect";
import DistributorPayment from "@/models/DistributorPayment";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params; // distributorGroup ID from URL

    if (!id) return errorResponse("Distributor Group ID is required");

    // Find payments for this distributorGroup
    const payments = await DistributorPayment.find({ distributorGroup: id })
      .populate({
        path: "distributorGroup",
        populate: {
          path: "distributor users.user",
          select: "name cnicNumber contactNumber",
        },
      })
      .lean();

    if (!payments || payments.length === 0) {
      return notFoundResponse("No payments found for this distributor");
    }

    return successResponse(payments, "Distributor payments fetched successfully");
  } catch (err) {
    return errorResponse(err);
  }
}
