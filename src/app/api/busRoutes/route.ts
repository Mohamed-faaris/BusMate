import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { boardingPoints } from "@/server/db/schema/boardingPoints";

export interface BoardingPoint {
  id: string | number;
  name: string;
  latitude?: number;
  longitude?: number;
}

export interface BoardingPointGet {
  boardingPoints: BoardingPoint[];
}

export async function GET() {
  try {
    const points = await db
      .select()
      .from(boardingPoints)
      .orderBy(boardingPoints.name);
    return NextResponse.json({ boardingPoints: points });
  } catch (error) {
    console.error("Error fetching boarding points:", error);
    return NextResponse.json(
      { error: "Error fetching boarding points" },
      { status: 500 },
    );
  }
}
