import dbConnect from "@/lib/dbConnect";
import DistributorGroup from "@/models/DistributorGroup";
import Distributor from "@/models/Distributor"; // ✅ chahiye hoga
import User from "@/models/User"; // ✅ agar user search karna hai
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const query = url.searchParams.get("q")?.trim();

    // 🔍 If query provided → single group search
    if (query) {
      let group = null;

      // 1) Try direct by _id
      try {
        // group = await DistributorGroup.findById(query)
        //   .populate("distributor", "name cnicNumber _id")
        //   .populate("users.user", "name cnicNumber contactNumber")
        //   .lean();

        group = await DistributorGroup.findOne({ distributor: query })
          .populate("distributor", "name cnicNumber contactNumber")
          .populate("users.user", "name cnicNumber contactNumber")
          .lean();

      } catch {
        // ignore invalid ObjectId format
      }

      // 2) Try by distributor name / cnic
      if (!group) {
        const distributor = await Distributor.findOne({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { cnicNumber: query },
          ],
        }).lean();

        if (distributor) {
          console.log("step 6.1");
          group = await DistributorGroup.findOne({
            distributor: distributor._id,
          })
            .populate("distributor", "name cnicNumber ")
            .populate("users.user", "name cnicNumber contactNumber")
            .lean();
        }
      }

      // 3) Try by user name / cnic
      if (!group) {
        const user = await User.findOne({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { cnicNumber: query },
            { contactNumber: query },
          ],
        }).lean();

        if (user) {
          group = await DistributorGroup.findOne({ "users.user": user._id })
            .populate("distributor", "name cnicNumber")
            .populate("users.user", "name cnicNumber contactNumber")
            .lean();
        }
      }

      if (!group) return notFoundResponse("Group not found");
      return successResponse(group, "Group fetched successfully");
    }

    // 📄 No query → paginated list
    const [total, data] = await Promise.all([
      DistributorGroup.countDocuments(),
      DistributorGroup.find()
        .populate("distributor", "name cnicNumber")
        .populate("users.user", "name cnicNumber contactNumber")
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse({ data, totalPages }, "Distributor groups fetched");
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body);
    const { distributor, areas, users, totalAmount, remarks } = body;

    if (
      !distributor ||
      !areas ||
      !users ||
      users.length === 0 ||
      !totalAmount
    ) {
      return errorResponse("All required fields must be provided");
    }

    // optional: validate unique users or eligibility here if needed
    console.log(distributor);
    console.log(areas);
    console.log(users);
    console.log(totalAmount);
    console.log(remarks);
    // const group = await DistributorGroup.create({
    //   distributor,
    //   areas,
    //   users,
    //   totalAmount,
    //   remarks,
    // });

    const group = await DistributorGroup.create({
      distributor,
      areas,
      users,
      totalAmount: totalAmount,
      remarks,
    });

    return createdResponse(group, "Distributor group created successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
