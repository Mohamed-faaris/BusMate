import { db } from "@/server/db";
import { busBoardingPoints, buses } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ boardingPointId: string }> },
) {
  const { boardingPointId } = await params;
  const busList = await db
    .select({
      id: buses.id,
      name: buses.busNumber
    })
    .from(busBoardingPoints)
    .where(eq(busBoardingPoints.boardingPointId, boardingPointId))
    .innerJoin(buses, eq(buses.id, busBoardingPoints.busId));

  return NextResponse.json(busList);
}
