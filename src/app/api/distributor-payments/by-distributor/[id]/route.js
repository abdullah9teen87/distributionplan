import dbConnect from "@/lib/dbConnect";
import DistributorPayment from "@/models/DistributorPayment";
import DistributorGroup from "@/models/DistributorGroup";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/apiResponse";


export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params; // distributor ki id (string)
    console.log("params1", id);

    if (!id) return errorResponse("Distributor ID is required");
    console.log("params2", id);

    // ✅ id ko ObjectId me cast karo
    const group = await DistributorGroup.findOne({ distributor: id })
    console.log("params3", id);

    console.log("group", group);

    if (!group) {
      return notFoundResponse("No group found for this distributor");
    }

    const payments = await DistributorPayment.find({
      distributorGroup: group._id,
    })
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

    return successResponse(
      { distributorGroup: group, payments },
      "Distributor group & payments fetched successfully"
    );
  } catch (err) {
    return errorResponse(err);
  }
}
