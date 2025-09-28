import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { buses } from "@/server/db/schema/buses";
import { models } from "@/server/db/schema/models";
import { eq } from "drizzle-orm";

/**
 * Retrieve details for a bus by ID, including its model information.
 *
 * @param params - A promise that resolves to route parameters; must include `busId` (the bus identifier).
 * @returns A NextResponse carrying JSON:
 *  - On success: `{ success: true, data }` with the bus record (including joined model) and HTTP status 200.
 *  - If not found: `{ error: "Bus not found" }` with HTTP status 404.
 *  - On error: `{ error: "Error fetching bus details" }` with HTTP status 500.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ busId: string }> },
) {
  try {
    // Fetch bus details with left join on model table
    const busId = (await params).busId;
    console.log(busId);

    const result = await db
      .select()
      .from(buses)
      .leftJoin(models, eq(models.id, buses.modelId))
      .where(eq(buses.id, busId))
      .limit(1);

    // .from(users)
    //.leftJoin(models, eq(buses.modelId, models.id))

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }
    // Send bus details along with model details
    return NextResponse.json(
      { success: true, data: result[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching bus details:", error);
    return NextResponse.json(
      { error: "Error fetching bus details" },
      { status: 500 },
    );
  }
}

// You can add additional methods (e.g., POST) here if required
