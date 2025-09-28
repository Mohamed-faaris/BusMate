import type { NextRequest } from "next/server";
import type { BoardingPoint } from "../busRoutes/route";
import { db } from "@/server/db";
import { buses } from "@/server/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { boardingPoints?: BoardingPoint } },
) {
  // Example implementation: return the boardingPoints param if present
  if (params.boardingPoints) {
    await db.select().from(buses);
    return Response.json({ boardingPoints: params.boardingPoints });
  }
  return Response.json(
    { message: "No boardingPoints provided" },
    { status: 400 },
  );
}
