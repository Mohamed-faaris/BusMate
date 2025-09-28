"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
} from "lucide-react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import type { DashboardApiResponseSuccess } from "@/app/api/dashboard/route";

async function fetchDashboardData(): Promise<DashboardApiResponseSuccess> {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json() as Promise<DashboardApiResponseSuccess>;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for editable fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch user data from dashboard API
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    refetch,
  } = useQuery<DashboardApiResponseSuccess>({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: fetchDashboardData,
    enabled: !!session?.user?.id,
    onSuccess: (data: DashboardApiResponseSuccess) => {
      // Initialize form data when data is loaded
      if (data?.user) {
        setFormData({
          name: (data.user as { name?: string }).name ?? "",
          email: (data.user as { email?: string }).email ?? "",
          phone: (data.user as { phone?: string }).phone ?? "",
        });
      }
    },
  });

  // Handle save changes
  const handleSave = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      // Refresh the data and exit edit mode
      await refetch();
      setIsEditing(false);

      // Show success message (you can add toast notification here)
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      // Handle error (you can add error toast notification here)
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (status === "loading" || isDashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Loading your account...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-lg border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-xl">Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Please sign in to view your account settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { user, boardingPoint, seat, bus } = dashboardData;

  if (!user) {
    return <div>User data not found</div>;
  }

  // Type assertion for user properties
  const userData = user as {
    name?: string;
    rollNo?: string;
    email?: string;
    phone?: string;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
              Account Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your profile and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm lg:col-span-2 dark:bg-slate-800/80">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-8 w-3 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                  >
                    {isEditing ? (
                      <>
                        <X className="mr-1 h-4 w-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit3 className="mr-1 h-4 w-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900 capitalize dark:text-slate-100">
                      {userData.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Student
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Active Account
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700"
                      />
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
                        <span className="text-slate-900 capitalize dark:text-slate-100">
                          {userData.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Calendar className="h-4 w-4" />
                      Roll Number
                    </Label>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
                      <span className="font-mono text-slate-900 uppercase dark:text-slate-100">
                        {userData.rollNo}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700"
                      />
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
                        <span className="text-slate-900 dark:text-slate-100">
                          {userData.email}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Enter phone number"
                        className="border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-700"
                      />
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
                        <span className="text-slate-900 dark:text-slate-100">
                          {userData.phone ?? "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <MapPin className="h-4 w-4" />
                      Boarding Point
                    </Label>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
                      <span className="text-slate-900 capitalize dark:text-slate-100">
                        {boardingPoint?.name ?? "Not selected"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* Booking Status Card */}
              <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-6 w-2 rounded-full bg-gradient-to-b from-green-500 to-emerald-600"></div>
                    Booking Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {seat ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-semibold">Active Booking</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Bus:
                          </span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {bus?.busNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Seat:
                          </span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {seat.seatId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Status:
                          </span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            Confirmed
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <AlertCircle className="mx-auto mb-2 h-8 w-8 text-amber-500" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        No active booking
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Security Card */}
              {/* <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-6 w-2 rounded-full bg-gradient-to-b from-red-500 to-pink-600"></div>
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Key className="mr-3 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Shield className="mr-3 h-4 w-4" />
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card> */}

              {/* Preferences Card */}
              {/* <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-6 w-2 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600"></div>
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Bell className="mr-3 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    App Settings
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
