// pages/api/distributor-payments/route.js (or wherever your API route is)
import dbConnect from "@/lib/dbConnect";
import DistributorPayment from "@/models/DistributorPayment";
import DistributorGroup from "@/models/DistributorGroup";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  createdResponse,
} from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;
    const month = url.searchParams.get("month");

    const filter = {};
    if (month) filter.month = month;

    const [total, data] = await Promise.all([
      DistributorPayment.countDocuments(filter),
      DistributorPayment.find(filter)
        .populate({
          path: "distributorGroup",
          populate: {
            path: "distributor users.user",
            select: "name cnicNumber contactNumber",
          },
        })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse({ data, totalPages }, "Distributor payments fetched successfully");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { distributorGroup, month, remarks, users } = body;

    if (!distributorGroup || !month || !users || users.length === 0) {
      return errorResponse("All required fields must be provided");
    }

    // 🔹 Populate users with amounts from the group if not provided
    const group = await DistributorGroup.findById(distributorGroup)
      .populate("users.user")
      .lean();

    if (!group) return notFoundResponse("Distributor group not found");

    const paymentUsers = group.users.map((u) => {
      const inputUser = users.find((x) => x.user === String(u.user._id));
      let amount = inputUser?.amount ?? u.amount ?? 0;

      // Carry forward logic
      let carryForward = false;
      if (u.status === "pending") carryForward = true;

      return {
        user: u.user._id,
        amount,
        status: inputUser?.status || "pending",
        carryForward,
        failedremarks: inputUser?.failedremarks || "",
      };
    });

    const totalAmount = paymentUsers.reduce((sum, u) => sum + u.amount, 0);

    const payment = await DistributorPayment.create({
      distributorGroup,
      month,
      remarks: remarks || "",
      users: paymentUsers,
      totalAmount,
    });

    return createdResponse(payment, "Distributor payment created successfully");
  } catch (err) {
    return errorResponse(err);
  }
}
