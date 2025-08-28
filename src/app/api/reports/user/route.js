import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
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

    const data = await User.find(filter).select("-password").lean();

    return successResponse(data, "User report fetched successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(err, 500);
  }
}
