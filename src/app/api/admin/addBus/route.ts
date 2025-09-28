import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { buses } from "@/server/db/schema/buses";
import { busBoardingPoints } from "@/server/db/schema/busBoardingPoints";
import { models } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { flattenBusSeats, seatsArrayToMap } from "@/lib/utils";

const createBusSchema = z.object({
  modelId: z.string().min(1, "Model is required"),
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

const busListQuery = db
  .select()
  .from(buses)
  .orderBy(buses.createdAt)
  .leftJoin(models, eq(buses.modelId, models.id))
  .leftJoin(busBoardingPoints, eq(buses.id, busBoardingPoints.busId));

export type AdminBusResponse = Awaited<typeof busListQuery>;
export async function GET() {
  try {
    const busesList: AdminBusResponse | undefined = await busListQuery;
    if (!busesList) {
      return NextResponse.json({ buses: [] });
    }
    return NextResponse.json({ buses: busesList });
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
      modelId,
      busNumber,
      routeName,
      driverName,
      driverPhone,
      boardingPoints,
    } = parseResult.data;

    const [seats] = await db
      .select()
      .from(models)
      .where(eq(models.id, modelId));

    if (!seats) {
      return NextResponse.json(
        { error: "Bus model not found" },
        { status: 404 },
      );
    }

    // Insert bus
    const [newBus] = await db
      .insert(buses)
      .values({
        modelId,
        busNumber,
        routeName,
        driverName,
        driverPhone,
        seats: seatsArrayToMap(flattenBusSeats(seats.data)),
      })
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
