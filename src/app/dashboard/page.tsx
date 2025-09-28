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
import {
  Loader2,
  User,
  MapPin,
  Bus,
  Calendar,
  Ticket as TicketIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DashboardApiResponseSuccess } from "@/app/api/dashboard/route";
import { motion } from "motion/react";
import { Ticket } from "@/components/Ticket";
import { useWindowSize } from "@/hooks/use-window-size";
import { MobileTicket } from "@/components/MobileTicket";

async function fetchDashboardData(): Promise<DashboardApiResponseSuccess> {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return await res.json() as DashboardApiResponseSuccess;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { width } = useWindowSize();

  const { data, isLoading, isError } = useQuery<DashboardApiResponseSuccess>({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: fetchDashboardData,
    enabled: !!session?.user?.id,
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Loading your dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-lg border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-xl">
                Unable to Load Dashboard
              </CardTitle>
              <CardDescription>
                There was an error loading your booking information
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-sm text-red-500">
                Failed to load dashboard data. Please try refreshing the page.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { user, seat, boardingPoint, bus } = data;

  // Mobile responsive check
  if (width && width < 730) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-6">
          {seat ? (
            // Mobile ticket view with booking
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Your Bus Ticket
                </h1>
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Booking Confirmed</span>
                </div>
              </div>

              {/* Ticket Card */}
              <Card className="overflow-hidden border-0 bg-white shadow-2xl dark:bg-slate-800">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <CardContent className="p-0">
                  <MobileTicket />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/dashboard/account" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Account Settings
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            // Mobile no booking state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex min-h-[600px] flex-col justify-center space-y-6"
            >
              <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
                <CardHeader className="pb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <TicketIcon className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle className="text-xl">
                    Welcome, {user.name}!
                  </CardTitle>
                  <CardDescription>
                    Ready to book your bus seat?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Roll No: {user.rollNo}</span>
                    </div>
                    {boardingPoint && (
                      <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm capitalize">
                          {boardingPoint.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link href="/dashboard/booking" className="block pt-4">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 font-semibold text-white hover:from-blue-600 hover:to-purple-700">
                      Book Your Seat Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {seat ? (
          // Desktop ticket view with booking
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
                Your Bus Ticket
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Booking Confirmed</span>
                </div>
                <div className="text-slate-400">•</div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Bus className="h-4 w-4" />
                  <span>Bus {bus?.busNumber}</span>
                </div>
                <div className="text-slate-400">•</div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <TicketIcon className="h-4 w-4" />
                  <span>Seat {seat.seatId}</span>
                </div>
              </div>
            </div>

            {/* Ticket */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur"></div>
                <Card className="relative overflow-hidden border-0 bg-white shadow-2xl dark:bg-slate-800">
                  <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <CardContent className="p-0">
                    <Ticket />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex justify-center gap-4">
              <Link href="/dashboard/account">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Account Settings
                </Button>
              </Link>
            </div> */}
          </motion.div>
        ) : (
          // Desktop no booking state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-[600px] items-center justify-center"
          >
            <div className="mx-auto max-w-2xl space-y-8 text-center">
              {/* Header */}
              <div className="space-y-4">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  <TicketIcon className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                  Welcome to BusMate, {user.name}!
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  You don&apos;t have any active bookings yet
                </p>
              </div>

              {/* User Info Card */}
              <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
                    <div className="space-y-2">
                      <User className="mx-auto h-8 w-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Student
                        </p>
                        <p className="font-semibold text-slate-900 capitalize dark:text-slate-100">
                          {user.name}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Calendar className="mx-auto h-8 w-8 text-purple-500" />
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Roll Number
                        </p>
                        <p className="font-semibold text-slate-900 uppercase dark:text-slate-100">
                          {user.rollNo}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <MapPin className="mx-auto h-8 w-8 text-emerald-500" />
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Boarding Point
                        </p>
                        <p className="font-semibold text-slate-900 capitalize dark:text-slate-100">
                          {boardingPoint?.name ?? "Not selected"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Link href="/dashboard/booking">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                >
                  Book Your Seat Now
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>

              {/* Additional Actions */}
              {/* <div className="flex justify-center gap-4 pt-4">
                <Link href="/dashboard/account">
                  <Button
                    variant="outline"
                    className="border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    Account Settings
                  </Button>
                </Link>
              </div> */}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
