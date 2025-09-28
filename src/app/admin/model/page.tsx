"use client";
import React, { useState } from "react";
import {
  flattenBusSeats,
  generateSeatColumns,
  seatsArrayToMap,
} from "@/lib/utils";
import BusWrapper from "@/components/bus/BusWrapper";
import type { BusModelProperties } from "@/server/db/schema";
import { BusPropsProvider } from "@/contexts/BusPropsContext";
import { SeatsDataProvider } from "@/contexts/seatsDataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { type models } from "@/server/db/schema";
import { Label } from "@radix-ui/react-label";

//TODO : do not use Form
export default function Page() {
  const [modelName, setModelName] = useState("");
  const [leftTopCols, setLeftTopCols] = useState(2);
  const [leftTopRows, setLeftTopRows] = useState(2);
  const [leftCols, setLeftCols] = useState(8);
  const [leftRows, setLeftRows] = useState(2);
  const [rightCols, setRightCols] = useState(10);
  const [rightRows, setRightRows] = useState(3);
  const [backCols, setBackCols] = useState(1);
  const [backRows, setBackRows] = useState(6);
  const [leftTopHeight, setLeftTopHeight] = useState<number>(80);
  const [doorHeight, setDoorHeight] = useState<number>(50);
  const [leftHeight, setLeftHeight] = useState<number>(40);
  const [rightHeight, setRightHeight] = useState<number>(40);
  const [driverHeight, setDriverHeight] = useState<number>(50);
  const [backHeight, setBackHeight] = useState<number>(50);

  // Prepare busSeats for preview and submission
  const busSeats: BusModelProperties = {
    leftTopSeatColumns: {
      height: leftTopHeight,
      seatsRows: generateSeatColumns(leftTopCols, leftTopRows, "A", "L"),
      seatsPerRow: leftTopRows,
    },
    door: { height: doorHeight },
    leftSeatColumns: {
      height: leftHeight,
      seatsRows: generateSeatColumns(
        leftCols,
        leftRows,
        String.fromCharCode("A".charCodeAt(0) + leftTopCols),
        "L",
      ),
      seatsPerRow: leftRows,
    },
    rightSeatColumns: {
      height: rightHeight,
      seatsRows: generateSeatColumns(rightCols, rightRows, "A", "R"),
      seatsPerRow: rightRows,
    },
    driver: { height: driverHeight },
    backSeats: {
      height: backHeight,
      seatsRows: generateSeatColumns(backCols, backRows, "A", "B"),
      seatsPerRow: backRows,
    },
  };

  const mutation = useMutation<
    { success: boolean; model: typeof models.$inferSelect },
    Error,
    void
  >({
    mutationFn: async () => {
      const res = await fetch("/api/admin/model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelName, data: busSeats }),
      });
      if (!res.ok) {
        const result = (await res.json()) as { error?: string };
        throw new Error(result.error ?? "Server error");
      }
      return res.json() as Promise<{
        success: boolean;
        model: typeof models.$inferSelect;
      }>;
    },
    onSuccess: () => {
      setModelName("");
      setLeftTopCols(3);
      setLeftTopRows(4);
      setLeftCols(8);
      setLeftRows(3);
      setRightCols(10);
      setRightRows(2);
      setBackCols(1);
      setBackRows(6);
      setLeftTopHeight(80);
      setDoorHeight(50);
      setLeftHeight(100);
      setRightHeight(100);
      setDriverHeight(50);
      setBackHeight(50);
      alert("Model saved successfully!");
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="flex w-full flex-col p-6">
      <h1 className="mb-4 text-2xl font-semibold">Configure Bus Model</h1>
      <div className="flex w-full justify-center gap-12">
        <Card className="mb-6 flex p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Model Name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
            <div className="flex justify-around">
              <div>
                <Label htmlFor="left-top-cols">Left Top Columns</Label>
                <Input
                  id="left-top-cols"
                  type="number"
                  placeholder="Left Top Columns"
                  value={leftTopCols}
                  onChange={(e) => setLeftTopCols(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="left-top-rows">Left Top Rows</Label>
                <Input
                  id="left-top-rows"
                  type="number"
                  placeholder="Left Top Rows"
                  value={leftTopRows}
                  onChange={(e) => setLeftTopRows(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="left-cols">Left Columns</Label>
                <Input
                  id="left-cols"
                  type="number"
                  placeholder="Left Columns"
                  value={leftCols}
                  onChange={(e) => setLeftCols(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="left-rows">Left Rows</Label>
                <Input
                  id="left-rows"
                  type="number"
                  placeholder="Left Rows"
                  value={leftRows}
                  onChange={(e) => setLeftRows(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="right-cols">Right Columns</Label>
                <Input
                  id="right-cols"
                  type="number"
                  placeholder="Right Columns"
                  value={rightCols}
                  onChange={(e) => setRightCols(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="right-rows">Right Rows</Label>
                <Input
                  id="right-rows"
                  type="number"
                  placeholder="Right Rows"
                  value={rightRows}
                  onChange={(e) => setRightRows(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="back-cols">Back Columns</Label>
                <Input
                  id="back-cols"
                  type="number"
                  placeholder="Back Columns"
                  value={backCols}
                  onChange={(e) => setBackCols(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="back-rows">Back Rows</Label>
                <Input
                  id="back-rows"
                  type="number"
                  placeholder="Back Rows"
                  value={backRows}
                  onChange={(e) => setBackRows(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Seat Group Heights</h2>
              <div>
                <label className="block">
                  Left Top Height: {leftTopHeight}
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={leftTopHeight}
                  onChange={(e) => setLeftTopHeight(parseInt(e.target.value))}
                  className="w-full"
                  title="Left Top Height"
                />
              </div>
              <div>
                <label className="block">Left Height: {leftHeight}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={leftHeight}
                  onChange={(e) => setLeftHeight(parseInt(e.target.value))}
                  className="w-full"
                  title="Left Height"
                />
              </div>
              <div>
                <label className="block">Right Height: {rightHeight}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={rightHeight}
                  onChange={(e) => setRightHeight(parseInt(e.target.value))}
                  className="w-full"
                  title="Right Height"
                />
              </div>
              <div>
                <label className="block">Back Height: {backHeight}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={backHeight}
                  onChange={(e) => setBackHeight(parseInt(e.target.value))}
                  className="w-full"
                  title="Back Height"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Component Heights</h2>
              <div>
                <label className="block">Door Height: {doorHeight}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={doorHeight}
                  onChange={(e) => setDoorHeight(parseInt(e.target.value))}
                  className="w-full"
                  title="Door Height"
                />
              </div>
              <div>
                <label className="block">Driver Height: {driverHeight}</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={driverHeight}
                  onChange={(e) => setDriverHeight(parseInt(e.target.value))}
                  className="w-full"
                  title="Driver Height"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded bg-blue-600 py-2 text-white"
            >
              {mutation.isPending ? "Adding..." : "Add Model"}
            </Button>
          </form>
        </Card>
        <BusPropsProvider>
          <SeatsDataProvider data={seatsArrayToMap(flattenBusSeats(busSeats))}>
            <BusWrapper
              busId="test"
              busSeats={busSeats}
              className="origin-top-left scale-[120%]"
            />
          </SeatsDataProvider>
        </BusPropsProvider>
      </div>
    </div>
  );
}
