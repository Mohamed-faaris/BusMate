"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  BoardingPoint,
  BoardingPointGet,
} from "@/app/api/busRoutes/route";

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
    unknown,
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
        throw new Error(data.error || "Error adding boarding point");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardingPoints"] });
      setName("");
      setLatitude("");
      setLongitude("");
    },
  });

  const [name, setName] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate({
      name,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
    });
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Manage Boarding Points</h1>
      <Card className="mb-6 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <Input
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
          <Button type="submit" disabled={addMutation.isLoading}>
            Add Boarding Point
          </Button>
        </form>
      </Card>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <ul className="space-y-2">
            {data?.map((point) => (
              <li key={point.id} className="rounded border p-2">
                {point.name} ({point.latitude}, {point.longitude})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
