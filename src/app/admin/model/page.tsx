"use client";
import React, { useState } from "react";
import { generateSeatColumns } from "@/lib/utils";
import BusWrapper from "@/components/bus/BusWrapper";
import type { BusModelProperties } from "@/server/db/schema";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // Prepare busSeats for preview and submission
  const busSeats: BusModelProperties = {
    leftTopSeatColumns: {
      height: leftTopHeight,
      seatsRows: generateSeatColumns(leftTopCols, leftTopRows),
    },
    door: { height: doorHeight },
    leftSeatColumns: {
      height: leftHeight,
      seatsRows: generateSeatColumns(leftCols, leftRows),
    },
    rightSeatColumns: {
      height: rightHeight,
      seatsRows: generateSeatColumns(rightCols, rightRows),
    },
    driver: { height: driverHeight },
    backSeats: {
      height: backHeight,
      seatsRows: generateSeatColumns(backCols, backRows),
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // use busSeats defined above

    try {
      const res = await fetch("/api/admin/model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelName, data: busSeats }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Server error");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-xl font-bold">Add New Bus Model</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Model Name</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              required
              placeholder="Model Name"
              title="Model Name"
              className="mt-1 w-full rounded border px-2 py-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block">Left Top Cols</label>
              <input
                type="number"
                value={leftTopCols}
                onChange={(e) => setLeftTopCols(parseInt(e.target.value))}
                min={0}
                placeholder="Left Top Cols"
                title="Left Top Cols"
                className="mt-1 w-full rounded border px-2 py-1"
              />
            </div>
            <div>
              <label className="block">Left Top Rows</label>
              <input
                type="number"
                value={leftTopRows}
                onChange={(e) => setLeftTopRows(parseInt(e.target.value))}
                min={0}
                placeholder="Left Top Rows"
                title="Left Top Rows"
                className="mt-1 w-full rounded border px-2 py-1"
              />
            </div>
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
              <label className="block">Left Top Height: {leftTopHeight}</label>
              <input
                type="range"
                min={0}
                max={10}
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
                max={10}
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
                max={10}
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
                max={10}
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
                max={10}
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
                max={10}
                value={driverHeight}
                onChange={(e) => setDriverHeight(parseInt(e.target.value))}
                className="w-full"
                title="Driver Height"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 text-white"
          >
            {loading ? "Adding..." : "Add Model"}
          </button>
          {error && <p className="mt-2 text-red-600">{error}</p>}
          {success && (
            <p className="mt-2 text-green-600">Model added successfully!</p>
          )}
        </form>
      </div>
      <BusWrapper busId="test" busSeats={busSeats} />
    </div>
  );
}
