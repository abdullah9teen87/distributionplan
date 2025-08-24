import dbConnect from "@/lib/dbConnect";
import DistributorPayment from "@/models/DistributorPayment";
import User from "@/models/User";
import {
  successResponse,
  createdResponse,
  errorResponse,
} from "@/lib/apiResponse";

// ✅ GET distributor payments (with pagination + optional distributor filter)
export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const distributorId = url.searchParams.get("distributor");
    const status = url.searchParams.get("status");

    const filter = {};
    if (distributorId) filter.distributor = distributorId;
    if (status) filter.status = status;

    const [total, data] = await Promise.all([
      DistributorPayment.countDocuments(filter),
      DistributorPayment.find(filter)
        .populate("distributor", "name cnicNumber contactNumber") // ✅ distributor details
        .populate("users.user", "name cnicNumber") // ✅ user details
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }) // latest first
        .lean(),
    ]);

    // ✅ Instead of 404, return empty array with 200
    if (total === 0) {
      return successResponse({ data: [], totalPages: 0 }, "No payments found");
    }

    const totalPages = Math.ceil(total / limit);

    return successResponse({ data, totalPages }, "Fetched payments");
  } catch (error) {
    return errorResponse(error);
  }
}

// ✅ POST new distributor payment
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { distributor, month, users, status, remarks } = body;

    if (!distributor || !month || !Array.isArray(users) || users.length === 0) {
      return errorResponse(
        new Error("Missing required fields or empty users array"),
        400
      );
    }

    // Fetch user data to check eligibility
    const userIds = users.map((u) => u.user);
    const dbUsers = await User.find({ _id: { $in: userIds } });

    const ineligibleUsers = dbUsers.filter((u) => u.status !== "depending");
    if (ineligibleUsers.length > 0) {
      const names = ineligibleUsers.map((u) => u.name).join(", ");
      return errorResponse(
        new Error(`These users are not eligible for payment: ${names}`),
        400
      );
    }

    // Validate failed users have failedremarks
    for (const u of users) {
      if (u.status === "failed" && !u.failedremarks) {
        return errorResponse(
          new Error(
            `User ${u.user} has failed status but no failedremarks provided.`
          ),
          400
        );
      }
    }

    const newPayment = await DistributorPayment.create({
      distributor,
      month,
      users,
      status,
      remarks,
    });

    return createdResponse(newPayment, "Distributor payment created");
  } catch (error) {
    return errorResponse(error);
  }
}
