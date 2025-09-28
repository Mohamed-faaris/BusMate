import type { NextRequest } from "next/server";
import type { BoardingPoint } from "../busRoutes/route";
import { db } from "@/server/db";
import { buses } from "@/server/db/schema";

/**
 * Responds with the provided boardingPoints or a 400 error if none were supplied.
 *
 * @param _request - Incoming HTTP request (unused).
 * @param params - Route parameters.
 * @param params.boardingPoints - Optional boarding points payload to echo back in the response.
 * @returns A Response whose JSON body is `{ boardingPoints: params.boardingPoints }` when `boardingPoints` is present; otherwise a JSON body `{ message: "No boardingPoints provided" }` with HTTP status 400.
 */
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
