import dbConnect from "@/lib/dbConnect";
import DistributorGroup from "@/models/DistributorGroup";
import {
  successResponse,
  createdResponse,
  errorResponse,
  conflictResponse,
  notFoundResponse,
} from "@/lib/apiResponse";

// export async function GET(req) {
//   try {
//     await dbConnect();
//     const url = new URL(req.url);

//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);
//     const skip = (page - 1) * limit;

//     const query = url.searchParams.get("q")?.trim();

//     let filter = {};
//     if (query) {
//       // optional: search by distributor name or user name
//       filter = {
//         $or: [
//           { "distributor.name": { $regex: query, $options: "i" } },
//           { "users.user.name": { $regex: query, $options: "i" } },
//         ],
//       };
//     }

//     const [total, data] = await Promise.all([
//       DistributorGroup.countDocuments(filter),
//       DistributorGroup.find(filter)
//         .populate("distributor", "name cnicNumber")
//         .populate("users.user", "name cnicNumber contactNumber")
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//     ]);

//     const totalPages = Math.ceil(total / limit);

    

//     return successResponse({ data, totalPages }, "Distributor groups fetched");
//   } catch (err) {
//     return errorResponse(err);
//   }
// }

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
