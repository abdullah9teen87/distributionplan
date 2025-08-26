import { connectDB } from "@/utils/db";
import DistributorGroup from "@/models/DistributorGroup";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/apiResponse";

// GET /api/distributor-groups/:id
export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = context.params;

    const group = await DistributorGroup.findById(id)
      .populate("distributor", "name cnicNumber contactNumber")
      .populate("users.user", "name cnicNumber contactNumber");

    if (!group) return notFoundResponse("Group not found");
    return successResponse(group, "Group fetched successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

// PUT /api/distributor-groups/:id
// export async function PUT(req, context) {
//   try {
//     await connectDB();
//     const { id } = await context.params;
//     const data = await req.json();

//     // 🛑 Normalize users (ensure only ObjectId + amount)
//     data.users = (data.users || []).map((u) => ({
//       user: typeof u.user === "object" && u.user._id ? u.user._id : u.user,
//       amount: u.amount || 0,
//     }));

//     // 🛑 Duplication check in other groups
//     for (const u of data.users) {
//       const exists = await DistributorGroup.findOne({
//         _id: { $ne: id }, // exclude current group
//         "users.user": u.user,
//       });

//       if (exists) {
//         return errorResponse(`User ${u.user} already exists in another group`);
//       }
//     }

//     // 🛑 Auto calculate totalAmount from users
//     data.totalAmount =
//       data.users.reduce((sum, u) => sum + (u.amount || 0), 0) || 0;

//     const updatedGroup = await DistributorGroup.findByIdAndUpdate(id, data, {
//       new: true,
//     })
//       .populate("distributor", "name cnicNumber contactNumber")
//       .populate("users.user", "name cnicNumber contactNumber");

//     if (!updatedGroup) return notFoundResponse("Group not found");
//     return successResponse(updatedGroup, "Group updated successfully");
//   } catch (error) {
//     return errorResponse(error);
//   }
// }

export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = await context.params; // ✅ await params
    const data = await req.json();

    // 🛑 Normalize users
    data.users = (data.users || []).map((u) => ({
      user: typeof u.user === "object" && u.user._id ? u.user._id : u.user,
      amount: Number(u.amount) || 0,
    }));

    // 🛑 Duplication check
    for (const u of data.users) {
      const exists = await DistributorGroup.findOne({
        _id: { $ne: id },
        "users.user": u.user,
      });
      if (exists) {
        return errorResponse(`User already exists in another group`, 400);
      }
    }

    // 🛑 Recalculate total
    data.totalAmount = data.users.reduce((sum, u) => sum + (u.amount || 0), 0);

    const updatedGroup = await DistributorGroup.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("distributor", "name cnicNumber contactNumber")
      .populate("users.user", "name cnicNumber contactNumber");

    if (!updatedGroup) return notFoundResponse("Group not found");
    return successResponse(updatedGroup, "Group updated successfully");
  } catch (error) {
    return errorResponse(error?.message || "Internal Server Error", 400);
  }
}

// DELETE /api/distributor-groups/:id
export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = context.params;

    const deletedGroup = await DistributorGroup.findByIdAndDelete(id);

    if (!deletedGroup) return notFoundResponse("Group not found");
    return successResponse(null, "Group deleted successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
