import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import Driver from '@/models/Driver';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { phone, pin } = await request.json();

    // Validate input
    if (!phone || !pin) {
      return NextResponse.json(
        { success: false, message: 'Phone number and PIN are required' },
        { status: 400 }
      );
    }

    // Find the driver by phone number and PIN
    const driver = await Driver.findOne({ phone, pin });

    if (!driver) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 201 }
      );
    }

    // Return driver data without sensitive information
    return NextResponse.json({
      success: true,
      driver: {
        _id: driver._id,
        name: driver.name,
        phone: driver.phone,
        vehicle: driver.vehicle,
      }
    });
  } catch (error) {
    console.error('Driver login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
