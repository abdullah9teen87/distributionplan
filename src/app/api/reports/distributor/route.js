import dbConnect from "@/lib/dbConnect";
import Distributor from "@/models/Distributor";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const month = parseInt(url.searchParams.get("month"), 10);
    const year = parseInt(url.searchParams.get("year"), 10);

    let filter = {};
    if (month && year) {
      filter.createdAt = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    }

    const data = await Distributor.find(filter).lean();

    return successResponse(data, "Distributor report fetched successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(err, 500);
  }
}
