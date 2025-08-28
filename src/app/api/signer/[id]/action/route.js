import dbConnect from "@/lib/dbConnect";
import Signer from "@/models/Signer";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/apiResponse";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();
    const { action } = body; // 'approve', 'reject', 'block'

    const signer = await Signer.findById(id);
    if (!signer) return notFoundResponse("Signer not found");

    if (action === "approve") {
      signer.isAdminApprove = true;
      signer.isVerified = true;
    } else if (action === "reject") {
      signer.isAdminApprove = false;
      signer.isVerified = false;
    } else if (action === "block") {
      signer.isAdminApprove = false;
      signer.isVerified = false;
      signer.role = "blocked";
    } else {
      return errorResponse("Invalid action");
    }

    await signer.save();
    return successResponse(signer, `Signer ${action}d successfully`);
  } catch (err) {
    return errorResponse(err);
  }
}
