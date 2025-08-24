import { connectDB } from '@/utils/db';
import Distributor from '@/models/Distributor';
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/apiResponse';

// GET /api/distributors/:id
export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = context.params;

    const distributor = await Distributor.findById(id);

    if (!distributor) return notFoundResponse('Distributor not found');
    return successResponse(distributor, 'Distributor fetched successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

// PUT /api/distributors/:id
export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = context.params;
    const data = await req.json();

    const updatedDistributor = await Distributor.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedDistributor) return notFoundResponse('Distributor not found');
    return successResponse(updatedDistributor, 'Distributor updated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

// DELETE /api/distributors/:id
export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = context.params;

    const deletedDistributor = await Distributor.findByIdAndDelete(id);

    if (!deletedDistributor) return notFoundResponse('Distributor not found');
    return successResponse(null, 'Distributor deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
