"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Bus,
  Shield,
  ShieldCheck,
} from "lucide-react";

interface UserData {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  college: string;
  receiptId: string | null;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  bus: {
    id: string;
    busNumber: string;
    routeName: string;
  } | null;
  boardingPoint: {
    id: string;
    name: string;
  } | null;
}

interface UserDetailsResponse {
  success: boolean;
  data: UserData[];
}

export default function UserDetailsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: userDetails,
    isLoading,
    error,
  } = useQuery<UserDetailsResponse>({
    queryKey: ["admin-user-details"],
    queryFn: () => fetch("/api/admin/userDetails").then((res) => res.json()),
  });

  const users = userDetails?.data ?? [];

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bus?.busNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-destructive text-center">
            <p className="text-lg font-medium">Error loading user details</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Please try again later
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-3 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              User Management
            </h1>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {users.length} Users
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-slate-400" />
              <Input
                placeholder="Search by name, email, roll number, college, or bus number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-slate-200 bg-white pl-12 text-lg focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
              />
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                      <div className="h-3 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                      <div className="h-3 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Users Grid */}
        {!isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="group border-0 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-800/80"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* User Avatar/Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                      <User className="h-6 w-6 text-white" />
                    </div>

                    {/* User Details */}
                    <div className="flex-1 space-y-3">
                      {/* Name and Status */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {user.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Roll: {user.rollNo}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {user.isAdmin && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              <Shield className="h-3 w-3" />
                              Admin
                            </span>
                          )}
                          {user.isVerified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <ShieldCheck className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      </div>

                      {/* College and Gender */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <GraduationCap className="h-4 w-4" />
                          <span className="font-medium">{user.college}</span>
                        </div>
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs capitalize dark:bg-slate-700">
                          {user.gender}
                        </span>
                      </div>

                      {/* Bus and Boarding Point */}
                      {(user.bus ?? user.boardingPoint) && (
                        <div className="space-y-1">
                          {user.bus && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Bus className="h-4 w-4" />
                              <span>
                                Bus {user.bus.busNumber}
                                {user.bus.routeName &&
                                  ` - ${user.bus.routeName}`}
                              </span>
                            </div>
                          )}
                          {user.boardingPoint && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <MapPin className="h-4 w-4" />
                              <span>{user.boardingPoint.name}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Registration Date */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Joined{" "}
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredUsers.length === 0 && searchTerm && (
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
            <div className="p-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-slate-100">
                No users found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search terms
              </p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && users.length === 0 && !searchTerm && (
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-slate-800/80">
            <div className="p-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-slate-100">
                No users registered yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Users will appear here once they register
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
