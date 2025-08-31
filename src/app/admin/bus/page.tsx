"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Trash2 } from "lucide-react";

interface BoardingPointOption {
  id: string;
  name: string;
}

interface Bus {
  id: string;
  model: string;
  busNumber: string;
  routeName?: string;
  driverName: string;
  driverPhone: string;
  createdAt: string;
  updatedAt: string;
}

interface BusBP {
  id: number;
  busId: string;
  boardingPointId: string;
  arrivalTime: string;
}

interface BusesResponse {
  buses: Bus[];
  busBoardingPoints: BusBP[];
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
      queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });

  const handleAddRow = () => {
    setBpRows([...bpRows, { boardingPointId: "", arrivalTime: "" }]);
  };

  const handleRowChange = (index: number, field: string, value: string) => {
    const rows = [...bpRows];
    // @ts-ignore
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
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Add Bus</h1>
      <div className="flex gap-2">
        <Card className="h-full w-md p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="model">Model</Label>
              <Select
                onValueChange={(value) => {
                  const selectedModel = modelsOptions?.models.find(
                    (m) => m.id === value,
                  );
                  setForm({
                    ...form,
                    modelId: value,
                    routeName: selectedModel?.model || "",
                  });
                }}
                value={form.modelId}
              >
                <SelectTrigger className="w-full">
                  <span>
                    {modelsOptions?.models.find((m) => m.id === form.modelId)
                      ?.model || "Select Model"}
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
            <div>
              <Label htmlFor="bus-number">Bus Number</Label>
              <Input
                id="bus-number"
                value={form.busNumber}
                onChange={(e) =>
                  setForm({ ...form, busNumber: e.target.value })
                }
                placeholder="Bus Number"
                required
              />
            </div>
            <div>
              <Label htmlFor="route-name">Route Name</Label>
              <Input
                id="route-name"
                value={form.routeName}
                onChange={(e) =>
                  setForm({ ...form, routeName: e.target.value })
                }
                placeholder="Route Name"
              />
            </div>
            <div>
              <Label htmlFor="driver-name">Driver Name</Label>
              <Input
                id="driver-name"
                value={form.driverName}
                onChange={(e) =>
                  setForm({ ...form, driverName: e.target.value })
                }
                placeholder="Driver Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="driver-phone">Driver Phone</Label>
              <Input
                id="driver-phone"
                value={form.driverPhone}
                onChange={(e) =>
                  setForm({ ...form, driverPhone: e.target.value })
                }
                placeholder="Driver Phone"
                required
              />
            </div>
            <h2 className="text-lg font-semibold">Boarding Points</h2>
            {bpRows.map((row, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-grow">
                  <Label htmlFor={`boarding-point-${idx}`}>
                    Boarding Point
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const selectedPoint = bpOptions?.boardingPoints.find(
                        (bp) => bp.id === value,
                      );
                      handleRowChange(idx, "boardingPointId", value);
                    }}
                    value={row.boardingPointId}
                  >
                    <SelectTrigger className="w-full">
                      <span>
                        {bpOptions?.boardingPoints.find(
                          (bp) => bp.id === row.boardingPointId,
                        )?.name || "Select point"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {bpOptions?.boardingPoints.map((bp) => (
                        <SelectItem key={bp.id} value={bp.id}>
                          {bp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`arrival-time-${idx}`}>Arrival Time</Label>
                  <Input
                    id={`arrival-time-${idx}`}
                    type="time"
                    value={row.arrivalTime}
                    onChange={(e) =>
                      handleRowChange(idx, "arrivalTime", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Label htmlFor={`remove-${idx}`} className="invisible">
                    r
                  </Label>
                  <Button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    variant="outline"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" onClick={handleAddRow} variant="secondary">
              Add Boarding Point
            </Button>
            <Button type="submit" variant="default">
              Save Bus
            </Button>
          </form>
        </Card>
        <Card className="flex-grow p-4">
          <h1 className="mt-8 text-2xl font-semibold">Existing Buses</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border">
              <thead className="">
                <tr>
                  <th className="border px-4 py-2 text-left">Number</th>
                  <th className="border px-4 py-2 text-left">Model</th>
                  <th className="border px-4 py-2 text-left">Route</th>
                  <th className="border px-4 py-2 text-left">Driver</th>
                  <th className="border px-4 py-2 text-left">Phone</th>
                  <th className="border px-4 py-2 text-left">Points</th>
                </tr>
              </thead>
              <tbody>
                {data?.buses?.map((item, idx) => {
                  const bus = item.bus;
                  const model = item.model;
                  const bp = item.busBoardingPoint;
                  const pts = bp ? [bp] : [];
                  return (
                    <tr key={idx} className="">
                      <td className="border px-4 py-2">{bus.busNumber}</td>
                      <td className="border px-4 py-2">
                        {model?.model || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {bus.routeName || "N/A"}
                      </td>
                      <td className="border px-4 py-2">{bus.driverName}</td>
                      <td className="border px-4 py-2">{bus.driverPhone}</td>
                      <td className="border px-4 py-2">
                        {pts.length > 0 ? (
                          <ul className="list-disc pl-4">
                            {pts.map((p, index) => (
                              <li key={`${p.id}-${index}`}>
                                {bpOptions?.boardingPoints.find(
                                  (bp) => bp.id === p.boardingPointId,
                                )?.name || p.boardingPointId}{" "}
                                @ {p.arrivalTime}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "No Points"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminBusPage;
