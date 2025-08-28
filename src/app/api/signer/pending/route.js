import dbConnect from "@/lib/dbConnect";
import Signer from "@/models/Signer";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await dbConnect();

    // Fetch pending signers (not verified and not admin approved)
    const pendingSigners = await Signer.find({ isAdminApprove: false }).lean();

    return successResponse(pendingSigners, "Pending signers fetched");
  } catch (err) {
    return errorResponse(err);
  }
}
