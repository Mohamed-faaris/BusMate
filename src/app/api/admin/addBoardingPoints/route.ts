import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { boardingPoints } from "@/server/db/schema/boardingPoints";

const createBoardingPointSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = createBoardingPointSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.errors },
        { status: 400 },
      );
    }
    const { name, latitude, longitude } = parseResult.data;
    const [newPoint] = await db
      .insert(boardingPoints)
      .values({ name, latitude, longitude })
      .returning();
    return NextResponse.json(
      { success: true, boardingPoint: newPoint },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding boarding point:", error);
    return NextResponse.json(
      { error: "Server error while adding boarding point" },
      { status: 500 },
    );
  }
}
