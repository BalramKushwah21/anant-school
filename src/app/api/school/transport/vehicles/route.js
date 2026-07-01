import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this path if your prisma.js is elsewhere

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId || schoolId === "undefined") {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { schoolId: schoolId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ data: vehicles }, { status: 200 });
  } catch (error) {
    console.error("GET Vehicles Error:", error);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}


// Add this inside the same route.js file
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, vehicleNumber, vehicleType, capacity, driverName, driverContact, status } = body;

    if (!id) return NextResponse.json({ error: "Vehicle ID required" }, { status: 400 });

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: id },
      data: { vehicleNumber, vehicleType, capacity: parseInt(capacity), driverName, driverContact, status }
    });

    return NextResponse.json({ data: updatedVehicle, message: "Updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const body = await request.json();
    const { schoolId, vehicleNumber, vehicleType, capacity, driverName, driverContact, status } = body;

    // 1. Strict Validation
    if (!schoolId) {
      return NextResponse.json({ error: "Missing School ID. Please ensure you are logged in." }, { status: 401 });
    }
    if (!vehicleNumber) {
      return NextResponse.json({ error: "Vehicle Number is required" }, { status: 400 });
    }

    // 2. Verify School Exists to prevent P2003 Foreign Key Crash
    const schoolExists = await prisma.school.findUnique({
      where: { id: schoolId }
    });

    if (!schoolExists) {
      return NextResponse.json({ error: "Invalid School ID. The school does not exist in the database." }, { status: 404 });
    }

    // 3. Create Vehicle
    const newVehicle = await prisma.vehicle.create({
      data: {
        schoolId,
        vehicleNumber,
        vehicleType,
        capacity: parseInt(capacity) || 40,
        driverName,
        driverContact,
        status: status || "Active"
      }
    });

    return NextResponse.json({ data: newVehicle, message: "Vehicle added successfully" }, { status: 201 });
  } catch (error) {
    console.error("POST Vehicle Error:", error);
    
    // Handle specific Prisma errors safely
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Vehicle Number already exists for this school" }, { status: 409 });
    }
    if (error.code === 'P2003') {
       return NextResponse.json({ error: "Database linking error. Invalid School ID." }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to add vehicle" }, { status: 500 });
  }
}