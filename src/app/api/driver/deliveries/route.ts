import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';

export async function GET(request: Request) {
    try {
        await connectDB();

        // Get the driver ID from the query parameters
        const { searchParams } = new URL(request.url);
        const driverId = searchParams.get('driverId');
        if (!driverId) {
            return NextResponse.json(
                { success: false, message: 'Driver ID is required' },
                { status: 400 }
            );
        }

        // Find all deliveries assigned to the driver
        // Sort by created date (newest first) and status
        // Populate the sale_id field to get the total_price
        const deliveries = await Delivery.find({ driver_id: driverId })
            .populate('sale_id', 'total_price') // Populate sale_id with total_price field
            .sort({ createdAt: -1, status: -1 })
            .lean()
            .limit(50);

            console.log(deliveries)
        return NextResponse.json({
            success: true,
            deliveries
        });
    } catch (error) {
        console.error('Error fetching driver deliveries:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
