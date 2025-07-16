"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BoardingPoint,BoardingPointGet } from "@/app/api/busRoutes/route";



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

  // Ensure points is always an array for mapping
  const points: BoardingPoint[] = data ?? [];
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Boarding Points</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="mb-1 block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">Latitude</label>
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Enter latitude"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">Longitude</label>
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Enter longitude"
          />
        </div>
        <button
          type="submit"
          disabled={addMutation.status === "pending"}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Add Boarding Point
        </button>
        {addMutation.error && (
          <p className="mt-2 text-red-600">
            {(addMutation.error as Error).message}
          </p>
        )}
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error loading boarding points</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Latitude</th>
              <th className="border px-4 py-2 text-left">Longitude</th>
            </tr>
          </thead>
          <tbody>
            {points.map((pt) => (
              <tr key={pt.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{pt.name}</td>
                <td className="border px-4 py-2">{pt.latitude ?? ""}</td>
                <td className="border px-4 py-2">{pt.longitude ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
