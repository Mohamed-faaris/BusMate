"use client";
import React, { useState } from "react";
import {
  flattenBusSeats,
  generateSeatColumns,
  seatsArrayToMap,
} from "@/lib/utils";
import BusWrapper from "@/components/bus/BusWrapper";
import type { BusModelProperties, Seat } from "@/server/db/schema";
import { SeatProvider } from "@/contexts/SeatContext";
import { SeatsDataProvider } from "@/contexts/seatsDataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";

//TODO : do not use Form
export default function Page() {
  const [modelName, setModelName] = useState("");
  const [leftTopCols, setLeftTopCols] = useState(3);
  const [leftTopRows, setLeftTopRows] = useState(4);
  const [leftCols, setLeftCols] = useState(8);
  const [leftRows, setLeftRows] = useState(3);
  const [rightCols, setRightCols] = useState(10);
  const [rightRows, setRightRows] = useState(2);
  const [backCols, setBackCols] = useState(1);
  const [backRows, setBackRows] = useState(6);
  const [leftTopHeight, setLeftTopHeight] = useState<number>(1);
  const [doorHeight, setDoorHeight] = useState<number>(1);
  const [leftHeight, setLeftHeight] = useState<number>(1);
  const [rightHeight, setRightHeight] = useState<number>(1);
  const [driverHeight, setDriverHeight] = useState<number>(1);
  const [backHeight, setBackHeight] = useState<number>(1);

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

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelName, data: busSeats }),
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Server error");
      }
      return res.json();
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
      setLeftTopHeight(1);
      setDoorHeight(1);
      setLeftHeight(1);
      setRightHeight(1);
      setDriverHeight(1);
      setBackHeight(1);
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
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Configure Bus Model</h1>
      <div className="flex justify-around">
        <Card className="mb-6 flex p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Model Name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Left Top Columns"
              value={leftTopCols}
              onChange={(e) => setLeftTopCols(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Left Top Rows"
              value={leftTopRows}
              onChange={(e) => setLeftTopRows(Number(e.target.value))}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block">Left Cols</label>
                <input
                  type="number"
                  value={leftCols}
                  onChange={(e) => setLeftCols(parseInt(e.target.value))}
                  min={0}
                  placeholder="Left Cols"
                  title="Left Cols"
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block">Left Rows</label>
                <input
                  type="number"
                  value={leftRows}
                  onChange={(e) => setLeftRows(parseInt(e.target.value))}
                  min={0}
                  placeholder="Left Rows"
                  title="Left Rows"
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block">Right Cols</label>
                <input
                  type="number"
                  value={rightCols}
                  onChange={(e) => setRightCols(parseInt(e.target.value))}
                  min={0}
                  placeholder="Right Cols"
                  title="Right Cols"
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block">Right Rows</label>
                <input
                  type="number"
                  value={rightRows}
                  onChange={(e) => setRightRows(parseInt(e.target.value))}
                  min={0}
                  placeholder="Right Rows"
                  title="Right Rows"
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block">Back Cols</label>
                <input
                  type="number"
                  value={backCols}
                  onChange={(e) => setBackCols(parseInt(e.target.value))}
                  min={0}
                  placeholder="Back Cols"
                  title="Back Cols"
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              </div>
              <div>
                <label className="block">Back Rows</label>
                <input
                  type="number"
                  value={backRows}
                  onChange={(e) => setBackRows(parseInt(e.target.value))}
                  min={0}
                  placeholder="Back Rows"
                  title="Back Rows"
                  className="mt-1 w-full rounded border px-2 py-1"
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
              disabled={mutation.isLoading}
              className="w-full rounded bg-blue-600 py-2 text-white"
            >
              {mutation.isLoading ? "Adding..." : "Add Model"}
            </Button>
          </form>
        </Card>
      <SeatProvider>
        <SeatsDataProvider data={seatsArrayToMap(flattenBusSeats(busSeats))}>
          <BusWrapper busId="test" busSeats={busSeats} className="sticky top-10"/>
        </SeatsDataProvider>
      </SeatProvider>
      </div>
    </div>
  );
}
