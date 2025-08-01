import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { buses } from "@/server/db/schema/buses";
import { busBoardingPoints } from "@/server/db/schema/busBoardingPoints";

const createBusSchema = z.object({
  model: z.string().min(1, "Model is required"),
  busNumber: z.string().min(1, "Bus number is required"),
  routeName: z.string().optional(),
  driverName: z.string().min(1, "Driver name is required"),
  driverPhone: z.string().min(1, "Driver phone is required"),
  boardingPoints: z
    .array(
      z.object({
        boardingPointId: z.string().uuid(),
        arrivalTime: z.string(),
      }),
    )
    .optional(),
});

export async function GET() {
  try {
    const busesList = await db.select().from(buses).orderBy(buses.createdAt);
    const bpList = await db.select().from(busBoardingPoints);
    return NextResponse.json({ buses: busesList, busBoardingPoints: bpList });
  } catch (error) {
    console.error("Error fetching buses:", error);
    return NextResponse.json(
      { error: "Error fetching buses" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // console.log("Received body:", body);
    const parseResult = createBusSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.errors },
        { status: 400 },
      );
    }
    const {
      model,
      busNumber,
      routeName,
      driverName,
      driverPhone,
      boardingPoints,
    } = parseResult.data;

    // Insert bus
    const [newBus] = await db
      .insert(buses)
      .values({ model, busNumber, routeName, driverName, driverPhone })
      .returning();

    let insertedPoints = [];
    if (boardingPoints && boardingPoints.length > 0) {
      const values = boardingPoints.map((bp) => ({
        busId: newBus.id,
        boardingPointId: bp.boardingPointId,
        arrivalTime: bp.arrivalTime,
      }));
      insertedPoints = await db
        .insert(busBoardingPoints)
        .values(values)
        .returning();
    }

    return NextResponse.json(
      { success: true, bus: newBus, boardingPoints: insertedPoints },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding bus:", error);
    return NextResponse.json(
      { error: "Server error while adding bus" },
      { status: 500 },
    );
  }
}
