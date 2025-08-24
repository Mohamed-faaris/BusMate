import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { boardingPoints, buses, seats, users } from "@/server/db/schema";
import { NextResponse } from "next/server";

const dashboardQuery = db
  .select()
  .from(users)
  .leftJoin(seats, eq(users.id, seats.userId))
  .leftJoin(boardingPoints, eq(users.boardingPointId, boardingPoints.id))
  .leftJoin(buses, eq(seats.busId, buses.id));

export type DashboardApiResponseSuccess = Awaited<
  ReturnType<typeof dashboardQuery['execute']>
>[number];

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // use the same query here
  const result = await dashboardQuery.where(eq(users.id, session.user.id));

  const userWithBookings: DashboardApiResponseSuccess | undefined = result[0];

  if (!userWithBookings) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json<DashboardApiResponseSuccess>(userWithBookings);
}