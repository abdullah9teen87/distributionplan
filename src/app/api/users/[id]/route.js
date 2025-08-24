// // // app/api/users/[id]/route.js

// // import { connectDB } from '@/utils/db';
// // import User from '@/models/User';
// // import {
// //   successResponse,
// //   errorResponse,
// //   notFoundResponse,
// // } from '@/lib/apiResponse';

// // // GET /api/users/:id
// // export async function GET(req, { params }) {
// //   try {
// //     await connectDB();
// //     const user = await User.findById(params.id);

// //     if (!user) return notFoundResponse(Response, 'User not found');
// //     return successResponse(Response, user, 'User fetched successfully');
// //   } catch (error) {
// //     return errorResponse(Response, error);
// //   }
// // }

// // // PUT /api/users/:id
// // export async function PUT(req, { params }) {
// //   try {
// //     await connectDB();
// //     const data = await req.json();

// //     const user = await User.findByIdAndUpdate(params.id, data, { new: true });
// //     if (!user) return notFoundResponse(Response, 'User not found');

// //     return successResponse(Response, user, 'User updated successfully');
// //   } catch (error) {
// //     return errorResponse(Response, error);
// //   }
// // }

// // // DELETE /api/users/:id
// // export async function DELETE(req, { params }) {
// //   try {
// //     await connectDB();
// //     const user = await User.findByIdAndDelete(params.id);
// //     if (!user) return notFoundResponse(Response, 'User not found');

// //     return successResponse(Response, null, 'User deleted successfully');
// //   } catch (error) {
// //     return errorResponse(Response, error);
// //   }
// // }


// // app/api/users/[id]/route.js

// import { connectDB } from '@/utils/db';
// import User from '@/models/User';
// import {
//   successResponse,
//   errorResponse,
//   notFoundResponse,
// } from '@/lib/apiResponse';

// // GET /api/users/:id
// export async function GET(req, { params }) {
//   try {
//     await connectDB();
//     const user = await User.findById(params.id);

//     if (!user) return notFoundResponse('User not found');
//     return successResponse(user, 'User fetched successfully');
//   } catch (error) {
//     return errorResponse(error);
//   }
// }

// // PUT /api/users/:id
// export async function PUT(req, { params }) {
//   try {
//     await connectDB();
//     const data = await req.json();

//     const user = await User.findByIdAndUpdate(params.id, data, { new: true });
//     if (!user) return notFoundResponse('User not found');

//     return successResponse(user, 'User updated successfully');
//   } catch (error) {
//     return errorResponse(error);
//   }
// }

// // DELETE /api/users/:id
// export async function DELETE(req, { params }) {
//   try {
//     await connectDB();
//     const user = await User.findByIdAndDelete(params.id);
//     if (!user) return notFoundResponse('User not found');

//     return successResponse(null, 'User deleted successfully');
//   } catch (error) {
//     return errorResponse(error);
//   }
// }



import { connectDB } from '@/utils/db';
import User from '@/models/User';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/apiResponse';

// GET /api/users/:id
export async function GET(req, context) {
  try {
    await connectDB();
    console.log("Fetching user with ID:"); // Debugging log
    const { id } = await context.params; // 👈 Await the params in App Router

    const user = await User.findById(id);

    if (!user) return notFoundResponse('User not found');
    return successResponse(user, 'User fetched successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

// PUT /api/users/:id
export async function PUT(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const data = await req.json();
    const user = await User.findByIdAndUpdate(id, data, { new: true });

    if (!user) return notFoundResponse('User not found');
    return successResponse(user, 'User updated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE /api/users/:id
export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) return notFoundResponse('User not found');
    return successResponse(null, 'User deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
