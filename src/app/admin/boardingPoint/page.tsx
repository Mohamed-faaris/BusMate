"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Plus,
  Search,
  Navigation,
  Trash2,
  Edit3,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type {
  BoardingPoint,
  BoardingPointGet,
} from "@/app/api/busRoutes/route";
import { boardingPoints } from "@/server/db/schema";

export default function BoardingPointPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<BoardingPoint[], Error>({
    queryKey: ["boardingPoints"],
    queryFn: async () => {
      const res = await fetch("/api/busRoutes");
      if (!res.ok) throw new Error("Error fetching boarding points");
      return res.json().then((data: BoardingPointGet) => data.boardingPoints);
    },
  });

  const addMutation = useMutation<
    { success: boolean; boardingPoint: typeof boardingPoints.$inferSelect },
    Error,
    { name: string; latitude?: number; longitude?: number }
  >({
    mutationFn: async (newPoint) => {
      const res = await fetch("/api/admin/addBoardingPoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPoint),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error adding boarding point");
      }
      return res.json();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["boardingPoints"] });
      setName("");
      setLatitude("");
      setLongitude("");
    },
  });

  const [name, setName] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate({
      name,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
    });
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your current location.");
      },
    );
  };

  // Filter boarding points based on search
  const filteredPoints =
    data?.filter((point) =>
      point.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
            Boarding Points Management
          </h1>
          <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <MapPin className="h-4 w-4" />
            Manage pickup and drop-off locations with GPS coordinates
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
          {/* Add New Boarding Point Form */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm xl:col-span-2 dark:bg-slate-800/80">
            <div className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-3 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600"></div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  Add New Location
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    <MapPin className="h-4 w-4" />
                    Location Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main Campus Gate, Central Library"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700"
                    required
                  />
                </div>

                {/* Coordinates Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-2 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      GPS Coordinates
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      className="ml-auto border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                      <Navigation className="mr-1 h-4 w-4" />
                      Use My Location
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="latitude"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        placeholder="e.g., 12.9716"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                        type="number"
                        step="any"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="longitude"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        placeholder="e.g., 77.5946"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                        type="number"
                        step="any"
                      />
                    </div>
                  </div>

                  {/* Future Maps Integration Placeholder */}
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <Globe className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">
                          Google Maps Integration
                        </p>
                        <p className="text-xs">
                          Interactive map selection coming soon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {addMutation.error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        {addMutation.error.message}
                      </span>
                    </div>
                  </div>
                )}

                {/* Success Display */}
                {addMutation.isSuccess && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">
                        Boarding point added successfully!
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={addMutation.isPending || !name.trim()}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl"
                >
                  {addMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Location...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Boarding Point
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Card>
          {/* Existing Boarding Points List */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm xl:col-span-3 dark:bg-slate-800/80">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-3 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                    Existing Locations
                  </h2>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {data?.length ?? 0} Points
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  <Input
                    placeholder="Search boarding points..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-slate-200 bg-white pl-10 focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-600"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-600"></div>
                          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-600"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="mb-2 font-medium text-red-600 dark:text-red-400">
                    Failed to load boarding points
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {error.message}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && filteredPoints.length === 0 && (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                    <MapPin className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="mb-2 font-medium text-slate-600 dark:text-slate-400">
                    {searchTerm
                      ? "No boarding points found"
                      : "No boarding points yet"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    {searchTerm
                      ? `No results for "${searchTerm}"`
                      : "Add your first boarding point using the form"}
                  </p>
                </div>
              )}

              {/* Boarding Points List */}
              {!isLoading && !error && filteredPoints.length > 0 && (
                <div className="space-y-3">
                  {filteredPoints.map((point) => (
                    <div
                      key={point.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors duration-150 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:bg-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        {/* Location Icon */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>

                        {/* Location Details */}
                        <div className="flex-1">
                          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {point.name}
                          </h3>

                          {/* Coordinates */}
                          <div className="mb-2 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Lat:</span>
                              <span className="rounded bg-slate-200 px-2 py-1 font-mono dark:bg-slate-800">
                                {point.latitude ?? "Not set"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Lng:</span>
                              <span className="rounded bg-slate-200 px-2 py-1 font-mono dark:bg-slate-800">
                                {point.longitude ?? "Not set"}
                              </span>
                            </div>
                          </div>

                          {/* GPS Status */}
                          <div className="flex items-center gap-2">
                            {point.latitude && point.longitude ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3" />
                                GPS Enabled
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                <AlertCircle className="h-3 w-3" />
                                GPS Coordinates Missing
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {point.latitude && point.longitude && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                              onClick={() => {
                                const url = `https://www.google.com/maps?q=${point.latitude},${point.longitude}`;
                                window.open(url, "_blank");
                              }}
                            >
                              <Globe className="mr-1 h-4 w-4" />
                              View on Map
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
