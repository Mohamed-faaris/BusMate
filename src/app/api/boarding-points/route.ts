import { db } from "@/server/db";
import { boardingPoints } from "@/server/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allBoardingPoints = await db.select().from(boardingPoints);
  return NextResponse.json(allBoardingPoints);
}
