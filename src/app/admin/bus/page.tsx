"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { AdminBusResponse } from "@/app/api/admin/addBus/route";
import { Trash2, Eye } from "lucide-react";

interface BoardingPointOption {
  id: string;
  name: string;
}

interface CreateBusInput {
  modelId: string;
  busNumber: string;
  routeName?: string;
  driverName: string;
  driverPhone: string;
  boardingPoints?: { boardingPointId: string; arrivalTime: string }[];
}

const AdminBusPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateBusInput>({
    modelId: "",
    busNumber: "",
    routeName: "",
    driverName: "",
    driverPhone: "",
    boardingPoints: [],
  });
  const [bpRows, setBpRows] = useState<
    { boardingPointId: string; arrivalTime: string }[]
  >([
    {
      boardingPointId: "",
      arrivalTime: "",
    },
  ]);

  const { data: bpOptions } = useQuery<{
    boardingPoints: BoardingPointOption[];
  }>({
    queryKey: ["boardingPoints"],
    queryFn: () => fetch("/api/busRoutes").then((res) => res.json()),
  });
  // Fetch available bus models
  const { data: modelsOptions } = useQuery<{
    models: { id: string; model: string }[];
  }>({
    queryKey: ["models"],
    queryFn: () => fetch("/api/admin/model").then((res) => res.json()),
  });

  const { data } = useQuery<AdminBusResponse>({
    queryKey: ["buses"],
    queryFn: () => fetch("/api/admin/addBus").then((res) => res.json()),
  });

  const createBus = useMutation<any, Error, CreateBusInput>({
    mutationFn: (newBus) =>
      fetch("/api/admin/addBus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBus),
      }).then((res) => res.json()),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });

  const handleAddRow = () => {
    setBpRows([...bpRows, { boardingPointId: "", arrivalTime: "" }]);
  };

  const handleRowChange = (index: number, field: string, value: string) => {
    const rows = [...bpRows];
    // @ts-expect-error - Dynamic property access on boarding point row object
    rows[index][field] = value;
    setBpRows(rows);
  };

  const handleRemoveRow = (index: number) => {
    setBpRows(bpRows.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBus.mutate({ ...form, boardingPoints: bpRows });
  };

  return (
    <div className="no-scrollbar min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
            Bus Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Add new buses and manage your fleet
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
          {/* Add Bus Form */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm xl:col-span-2 dark:bg-slate-800/80">
            <div className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-3 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  Add New Bus
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Model Selection */}
                <div className="space-y-2">
                  <Label
                    htmlFor="model"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Bus Model *
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedModel = modelsOptions?.models.find(
                        (m) => m.id === value,
                      );
                      setForm({
                        ...form,
                        modelId: value,
                        routeName: selectedModel?.model ?? "",
                      });
                    }}
                    value={form.modelId}
                  >
                    <SelectTrigger className="w-full border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700">
                      <span>
                        {modelsOptions?.models.find(
                          (m) => m.id === form.modelId,
                        )?.model ?? "Select Model"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {modelsOptions?.models.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bus Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="bus-number"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Bus Number *
                  </Label>
                  <Input
                    id="bus-number"
                    value={form.busNumber}
                    onChange={(e) =>
                      setForm({ ...form, busNumber: e.target.value })
                    }
                    placeholder="e.g., Bus-001"
                    className="border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                    required
                  />
                </div>

                {/* Route Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="route-name"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Route Name
                  </Label>
                  <Input
                    id="route-name"
                    value={form.routeName}
                    onChange={(e) =>
                      setForm({ ...form, routeName: e.target.value })
                    }
                    placeholder="e.g., Main Campus Route"
                    className="border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>

                {/* Driver Details */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="driver-name"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Driver Name *
                    </Label>
                    <Input
                      id="driver-name"
                      value={form.driverName}
                      onChange={(e) =>
                        setForm({ ...form, driverName: e.target.value })
                      }
                      placeholder="Driver's full name"
                      className="border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="driver-phone"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Driver Phone *
                    </Label>
                    <Input
                      id="driver-phone"
                      value={form.driverPhone}
                      onChange={(e) =>
                        setForm({ ...form, driverPhone: e.target.value })
                      }
                      placeholder="Phone number"
                      className="border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                      required
                    />
                  </div>
                </div>

                {/* Boarding Points Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-2 rounded-full bg-gradient-to-b from-green-500 to-emerald-600"></div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      Boarding Points
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {bpRows.map((row, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50"
                      >
                        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
                          <div className="space-y-2 md:col-span-2">
                            <Label
                              htmlFor={`boarding-point-${idx}`}
                              className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                              Boarding Point
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                handleRowChange(idx, "boardingPointId", value);
                              }}
                              value={row.boardingPointId}
                            >
                              <SelectTrigger className="w-full border-slate-200 bg-white dark:border-slate-500 dark:bg-slate-600">
                                <span>
                                  {bpOptions?.boardingPoints?.find(
                                    (bp) => bp.id === row.boardingPointId,
                                  )?.name ?? "Select boarding point"}
                                </span>
                              </SelectTrigger>
                              <SelectContent>
                                {bpOptions?.boardingPoints?.map((bp) => (
                                  <SelectItem key={bp.id} value={bp.id}>
                                    {bp.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor={`arrival-time-${idx}`}
                              className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                              Arrival Time
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id={`arrival-time-${idx}`}
                                type="time"
                                value={row.arrivalTime}
                                onChange={(e) =>
                                  handleRowChange(
                                    idx,
                                    "arrivalTime",
                                    e.target.value,
                                  )
                                }
                                className="border-slate-200 bg-white dark:border-slate-500 dark:bg-slate-600"
                                required
                              />
                              <Button
                                type="button"
                                onClick={() => handleRemoveRow(idx)}
                                variant="outline"
                                size="sm"
                                className="px-3 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddRow}
                    variant="secondary"
                    className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    + Add Boarding Point
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                  disabled={createBus.isPending}
                >
                  {createBus.isPending ? "Creating Bus..." : "Create Bus"}
                </Button>
              </form>
            </div>
          </Card>
          {/* Existing Buses Table */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm xl:col-span-3 dark:bg-slate-800/80">
            <div className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-3 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600"></div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  Fleet Overview
                </h2>
                <div className="ml-auto">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {data?.buses?.length ?? 0} Buses
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                          Bus Number
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                          Model
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                          Route
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                          Driver
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                          Boarding Points
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                      {data?.buses?.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                <svg
                                  className="h-8 w-8 text-slate-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </div>
                              <p className="font-medium text-slate-600 dark:text-slate-400">
                                No buses found
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-500">
                                Add your first bus using the form on the left
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        data?.buses?.map((item, idx) => {
                          const bus = item.bus;
                          const model = item.model;
                          const bp = item.busBoardingPoint;
                          const pts = bp ? [bp] : [];
                          return (
                            <tr
                              key={idx}
                              className="transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="mr-3 h-8 w-2 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
                                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {bus.busNumber}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="rounded bg-purple-100 px-2 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                  {model?.model ?? "N/A"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-400">
                                {bus.routeName ?? (
                                  <span className="text-slate-400 italic dark:text-slate-500">
                                    No route assigned
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900 dark:text-slate-200">
                                {bus.driverName}
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-400">
                                {bus.driverPhone}
                              </td>
                              <td className="px-6 py-4">
                                {pts.length > 0 ? (
                                  <div className="space-y-1">
                                    {pts.map((p, index) => (
                                      <div
                                        key={`${p.id}-${index}`}
                                        className="flex items-center gap-2 text-xs"
                                      >
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                          {bpOptions?.boardingPoints?.find(
                                            (bp) => bp.id === p.boardingPointId,
                                          )?.name ?? p.boardingPointId}
                                        </span>
                                        <span className="text-slate-500 dark:text-slate-400">
                                          @ {p.arrivalTime}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 italic dark:text-slate-500">
                                    No boarding points
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/admin/bus/${bus.id}`)
                                  }
                                  className="flex items-center gap-2 border-blue-200 bg-blue-50 text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBusPage;
