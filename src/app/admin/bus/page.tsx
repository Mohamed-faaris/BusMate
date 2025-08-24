"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Manage Buses</h1>
      <Card className="mb-6 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            name="modelId"
            placeholder="Model ID"
            value={form.modelId}
            onChange={handleChange}
          />
          <Input
            name="busNumber"
            placeholder="Bus Number"
            value={form.busNumber}
            onChange={handleChange}
          />
          <Input
            name="routeName"
            placeholder="Route Name"
            value={form.routeName}
            onChange={handleChange}
          />
          <Input
            name="driverName"
            placeholder="Driver Name"
            value={form.driverName}
            onChange={handleChange}
          />
          <Input
            name="driverPhone"
            placeholder="Driver Phone"
            value={form.driverPhone}
            onChange={handleChange}
          />
          <Button type="submit">Add Bus</Button>
        </form>
      </Card>
      {/* Add logic to display buses here */}
    </div>
  );
};

export default AdminBusPage;
