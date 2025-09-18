import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { buses, models, users, seats, boardingPoints } from "@/server/db/schema";
import { eq, sql, and, gte } from "drizzle-orm";

export async function GET() {
  try {
    // Get total buses count
    const totalBusesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(buses);
    const totalBuses = totalBusesResult[0]?.count || 0;

    // Get active routes (boarding points) count
    const activeBoardingPointsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(boardingPoints);
    const activeRoutes = activeBoardingPointsResult[0]?.count || 0;

    // Get total passengers (registered users)
    const totalPassengersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const totalPassengers = totalPassengersResult[0]?.count || 0;

    // Get today's bookings (seats booked today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayBookingsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(seats)
      .where(gte(seats.createdAt, today));
    const todayBookings = todayBookingsResult[0]?.count || 0;

    // Get bus models count
    const busModelsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(models);
    const busModels = busModelsResult[0]?.count || 0;

    // Get recent activities (last 10 actions)
    const recentUsers = await db
      .select({
        name: users.name,
        createdAt: users.createdAt,
        busId: users.busId,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} DESC`)
      .limit(5);

    const recentBuses = await db
      .select({
        busNumber: buses.busNumber,
        driverName: buses.driverName,
        createdAt: buses.createdAt,
      })
      .from(buses)
      .orderBy(sql`${buses.createdAt} DESC`)
      .limit(3);

    const recentSeats = await db
      .select({
        seatId: seats.seatId,
        createdAt: seats.createdAt,
        userId: seats.userId,
      })
      .from(seats)
      .leftJoin(users, eq(seats.userId, users.id))
      .orderBy(sql`${seats.createdAt} DESC`)
      .limit(5);

    // Format recent activities
    const recentActivities = [
      ...recentBuses.map(bus => ({
        action: "New bus added",
        details: `${bus.busNumber} (Driver: ${bus.driverName}) was added to the fleet`,
        time: formatTimeAgo(bus.createdAt),
        type: "success" as const,
      })),
      ...recentUsers.slice(0, 3).map(user => ({
        action: "New registration",
        details: `${user.name} registered for bus service`,
        time: formatTimeAgo(user.createdAt),
        type: "info" as const,
      })),
      ...recentSeats.slice(0, 2).map(seat => ({
        action: "Seat booked",
        details: `Seat ${seat.seatId} was booked`,
        time: formatTimeAgo(seat.createdAt),
        type: "success" as const,
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalBuses,
          activeRoutes,
          totalPassengers,
          todayBookings,
          busModels,
        },
        recentActivities,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard data" },
      { status: 500 },
    );
  }
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 60) {
    return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }
}