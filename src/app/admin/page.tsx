"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Bus, MapPin, Settings, Users, BarChart3, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  totalBuses: number;
  activeRoutes: number;
  totalPassengers: number;
  todayBookings: number;
  busModels: number;
}

interface RecentActivity {
  action: string;
  details: string;
  time: string;
  type: "success" | "info";
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
}

export default function AdminPage() {
  // Fetch real-time dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<{
    success: boolean;
    data: DashboardData;
  }>({
    queryKey: ["admin-dashboard"],
    queryFn: () => fetch("/api/admin/dashboard").then((res) => res.json()),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const stats = dashboardData?.data?.stats;
  const recentActivities = dashboardData?.data?.recentActivities || [];

  const dashboardCards = [
    {
      title: "Boarding Points",
      description: "Manage pickup and drop-off locations",
      href: "/admin/boardingPoint",
      icon: MapPin,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      iconBg: "bg-blue-500",
      stats: stats ? `${stats.activeRoutes} Active Points` : "Loading...",
    },
    {
      title: "Bus Models",
      description: "Configure bus types and seating layouts",
      href: "/admin/model",
      icon: Settings,
      gradient: "from-purple-500 to-pink-500",
      bgGradient:
        "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      iconBg: "bg-purple-500",
      stats: stats ? `${stats.busModels} Model Types` : "Loading...",
    },
    {
      title: "Fleet Management",
      description: "Add, edit and monitor your bus fleet",
      href: "/admin/bus",
      icon: Bus,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient:
        "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      iconBg: "bg-emerald-500",
      stats: stats ? `${stats.totalBuses} Buses Active` : "Loading...",
    },
    {
      title: "User Management",
      description: "View and manage passenger accounts",
      href: "/admin/userDetails",
      icon: Users,
      gradient: "from-orange-500 to-red-500",
      bgGradient:
        "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      iconBg: "bg-orange-500",
      stats: stats ? `${stats.totalPassengers} Registered Users` : "Loading...",
    },
  ];

  const quickStats = [
    {
      label: "Total Buses",
      value: stats?.totalBuses?.toString() || "0",
      change: "", // You could calculate this from historical data
      changeType: "positive" as const,
      icon: Bus,
    },
    {
      label: "Active Routes",
      value: stats?.activeRoutes?.toString() || "0",
      change: "",
      changeType: "positive" as const,
      icon: MapPin,
    },
    {
      label: "Total Passengers",
      value: stats?.totalPassengers?.toString() || "0",
      change: " ",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      label: "Today's Bookings",
      value: stats?.todayBookings?.toString() || "0",
      change: `+${stats?.todayBookings || 0}`,
      changeType: "positive" as const,
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your bus transportation system
            {!isLoading && !error && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                Live Data
              </span>
            )}
          </p>
          {error && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400">
                Unable to load real-time data. Showing cached information.
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-slate-800/80"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {isLoading ? (
                      <div className="h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    ) : (
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {stat.value}
                      </span>
                    )}
                    {!isLoading && (
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === "positive"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Management Cards */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Management Tools
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {dashboardCards.map((card, index) => (
              <Link key={index} href={card.href}>
                <Card
                  className={`h-full bg-gradient-to-br p-6 ${card.bgGradient} group transform cursor-pointer border-0 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-14 w-14 ${card.iconBg} flex items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <card.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-slate-700 dark:text-slate-100 dark:group-hover:text-slate-200">
                        {card.title}
                      </h3>
                      <p className="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {card.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-500">
                          {card.stats}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300">
                          <span className="text-xs">Manage</span>
                          <svg
                            className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
          <div className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-3 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                Recent Activity
              </h2>
              {!isLoading && (
                <div className="ml-auto">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Live Updates
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50"
                  >
                    <div className="h-3 w-3 animate-pulse rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-32 animate-pulse rounded bg-slate-300 dark:bg-slate-600"></div>
                        <div className="h-3 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-600"></div>
                      </div>
                      <div className="h-3 w-48 animate-pulse rounded bg-slate-300 dark:bg-slate-600"></div>
                    </div>
                  </div>
                ))
              ) : recentActivities.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                    <Clock className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-600 dark:text-slate-400">
                    No recent activity
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Activity will appear here as actions are performed
                  </p>
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50"
                  >
                    <div
                      className={`h-3 w-3 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {activity.action}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 text-center">
              {/* <Button
                variant="outline"
                className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                disabled={isLoading}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {isLoading ? "Loading..." : "View Full Activity Log"}
              </Button> */}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
