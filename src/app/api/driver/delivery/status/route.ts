import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';

export async function PUT(request: Request) {
  try {
    await connectDB();
    
    // Parse request body
    const { deliveryId, status } = await request.json();

    // Validate required fields
    if (!deliveryId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Valid status values
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Find the delivery and verify it belongs to the driver
    const delivery = await Delivery.findOne({ _id: deliveryId });
    
    if (!delivery) {
      return NextResponse.json(
        { success: false, message: 'Delivery not found or not assigned to this driver' },
        { status: 404 }
      );
    }

    // Update the delivery status
    delivery.status = status;
    await delivery.save();

    return NextResponse.json({
      success: true,
      message: 'Delivery status updated successfully',
      delivery
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
