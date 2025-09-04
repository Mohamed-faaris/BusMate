import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { models } from "@/server/db/schema/models";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { modelId: string } },
) {
  try {
    const [model] = await db
      .select()
      .from(models)
      .where(eq(models.id, params.modelId));
    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    return NextResponse.json({ model });
  } catch (error) {
    console.error("Error fetching model by ID:", error);
    return NextResponse.json(
      { error: "Error fetching model" },
      { status: 500 },
    );
  }
}
