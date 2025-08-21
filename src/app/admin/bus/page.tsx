"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  >([]);

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

  const { data } = useQuery<BusesResponse>({
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
      // setForm({
      //   model: "",
      //   busNumber: "",
      //   routeName: "",
      //   driverName: "",
      //   driverPhone: "",
      //   boardingPoints: [],
      // });
      // setBpRows([]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBus.mutate({ ...form, boardingPoints: bpRows });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Add Bus</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="block font-medium">Model</label>
          <select
            value={form.modelId}
            onChange={(e) => setForm({ ...form, modelId: e.target.value })}
            required
            title="Model"
            className="mt-1 w-full rounded border px-2 py-1"
          >
            <option value="">Select Model</option>
            {modelsOptions?.models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.model}
              </option>
            ))}
          </select>
        </div>
        <input
          value={form.busNumber}
          onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
          placeholder="Bus Number"
          title="Bus Number"
          required
        />
        <input
          value={form.routeName}
          onChange={(e) => setForm({ ...form, routeName: e.target.value })}
          placeholder="Route Name"
          title="Route Name"
        />
        <input
          value={form.driverName}
          onChange={(e) => setForm({ ...form, driverName: e.target.value })}
          placeholder="Driver Name"
          title="Driver Name"
          required
        />
        <input
          value={form.driverPhone}
          onChange={(e) => setForm({ ...form, driverPhone: e.target.value })}
          placeholder="Driver Phone"
          title="Driver Phone"
          required
        />
        <h2 className="font-semibold">Boarding Points</h2>
        {bpRows.map((row, idx) => (
          <div key={idx} className="flex space-x-2">
            <select
              value={row.boardingPointId}
              onChange={(e) =>
                handleRowChange(idx, "boardingPointId", e.target.value)
              }
              required
              title="Select Boarding Point"
            >
              <option value="">Select point</option>
              {bpOptions?.boardingPoints.map((bp) => (
                <option key={bp.id} value={bp.id}>
                  {bp.name}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={row.arrivalTime}
              onChange={(e) =>
                handleRowChange(idx, "arrivalTime", e.target.value)
              }
              title="Arrival Time"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRow}
          className="rounded bg-gray-500 px-3 py-2 text-white"
        >
          Add Boarding Point
        </button>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white"
        >
          Save Bus
        </button>
      </form>

      <h1 className="mt-8 text-xl font-bold">Existing Buses</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th>Number</th>
            <th>Model</th>
            <th>Route</th>
            <th>Driver</th>
            <th>Phone</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {data?.buses.map((bus) => {
            const pts = data.busBoardingPoints.filter(
              (b) => b.busId === bus.id,
            );
            return (
              <tr key={bus.id}>
                <td>{bus.busNumber}</td>
                <td>{bus.model}</td>
                <td>{bus.routeName}</td>
                <td>{bus.driverName}</td>
                <td>{bus.driverPhone}</td>
                <td>
                  {pts.map((p) => (
                    <div key={p.id}>
                      {p.id} @ {p.arrivalTime}
                    </div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBusPage;
