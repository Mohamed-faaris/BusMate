"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DashboardApiResponseSuccess } from "@/app/api/dashboard/route";
import { motion } from "motion/react";
import { motionConfig } from "@/lib/motion";

async function fetchDashboardData(): Promise<DashboardApiResponseSuccess> {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: fetchDashboardData,
    enabled: !!session?.user?.id,
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  if (isError || !data) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Your Dashboard</CardTitle>
            <CardDescription>Profile and booking overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-sm text-red-500">
              Failed to load dashboard data.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, seat, boardingPoint } = data as unknown as {
    user: DashboardApiResponseSuccess["user"];
    seat: DashboardApiResponseSuccess["seat"];
    boardingPoint: DashboardApiResponseSuccess["boardingPoint"];
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Your Dashboard</CardTitle>
          <CardDescription>Profile and booking overview</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={motionConfig.variants.step}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="grid gap-2 rounded-md border p-4">
              <h3 className="text-muted-foreground text-sm font-semibold">
                User Details
              </h3>
              <div className="grid gap-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Roll:</span> {user.rollNo}
                </p>
              </div>
            </div>

            <div className="grid gap-2 rounded-md border p-4">
              <h3 className="text-muted-foreground text-sm font-semibold">
                Booking Details
              </h3>
              {seat ? (
                <div className="grid gap-1 text-sm">
                  <p>
                    <span className="font-medium">Bus ID:</span> {seat.busId}
                  </p>
                  <p>
                    <span className="font-medium">Seat ID:</span> {seat.id}
                  </p>
                  {boardingPoint && (
                    <p>
                      <span className="font-medium">Boarding Point:</span>{" "}
                      {boardingPoint.name}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4 text-sm">
                    No ticket found.
                  </p>
                  <Link href="/dashboard/booking">
                    <Button className="w-full sm:w-auto">Book Now</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
