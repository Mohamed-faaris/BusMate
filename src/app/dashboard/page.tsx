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
import { Ticket } from "@/components/Ticket";

async function fetchDashboardData(): Promise<DashboardApiResponseSuccess> {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const { data, isLoading, isError } = useQuery<DashboardApiResponseSuccess>({
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

  const { user, seat, boardingPoint, bus } = data;

  return (
    <div className="mx-auto p-6">
          <Ticket className="" />
    </div>
  );
}
