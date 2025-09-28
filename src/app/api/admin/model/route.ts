import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { models } from "@/server/db/schema/models";

// Define schemas for model properties
const seatSchema = z.object({
  id: z.string().min(1),
  seatStatus: z
    .enum([
      "available",
      "bookedMale",
      "bookedFemale",
      "reserved",
      "unavailable",
    ])
    .optional(),
});

const seatRowsSchema = z.array(seatSchema);

const seatGroupsSchema = z.object({
  height: z.number().optional(),
  seatsRows: z.array(seatRowsSchema),
});

const busComponentsSchema = z.object({
  height: z.number().optional(),
});

const modelDataSchema = z.object({
  leftTopSeatColumns: seatGroupsSchema,
  door: busComponentsSchema.optional(),
  leftSeatColumns: seatGroupsSchema,
  rightSeatColumns: seatGroupsSchema,
  driver: busComponentsSchema.optional(),
  backSeats: seatGroupsSchema,
});

const createModelSchema = z.object({
  model: z.string().min(1, "Model name is required"),
  data: modelDataSchema,
});

// GET: List all bus models
export async function GET() {
  try {
    // Fetch only id and model name for list
    const list = await db
      .select({ id: models.id, model: models.model })
      .from(models);
    //.orderBy(models.createdAt);
    return NextResponse.json({ models: list });
  } catch (error) {
    console.error("Error fetching model list:", error);
    return NextResponse.json(
      { error: "Error fetching models" },
      { status: 500 },
    );
  }
}

/**
 * Creates a new bus model from the request JSON and stores it in the database.
 *
 * Validates the request body against the expected model schema and returns the newly created model on success.
 *
 * @param request - Incoming NextRequest whose JSON body must match `createModelSchema` (contains `model` and `data`).
 * @returns On success: `{ success: true, model }` with HTTP 201. On validation failure: `{ error: "Invalid input", details }` with HTTP 400. On server error: `{ error: "Server error while adding model" }` with HTTP 500.
 */
export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parseResult = createModelSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(
        "Model schema validation error: Invalid input:",
        body,
        parseResult.error.issues,
      );
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.errors },
        { status: 400 },
      );
    }
    const { model: modelName, data } = parseResult.data;
    const [newModel] = await db
      .insert(models)
      .values({ model: modelName, data })
      .returning();

    return NextResponse.json(
      { success: true, model: newModel },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding model:", error);
    return NextResponse.json(
      { error: "Server error while adding model" },
      { status: 500 },
    );
  }
}
