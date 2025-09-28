"use client";
import React from "react";
import BusWrapper from "./BusWrapper";

import { generateSeatColumns } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { SeatsDataProvider } from "@/contexts/seatsDataContext";

import type { SeatStatus, BusModelProperties } from "@/server/db/schema/models";

type BusData = {
  bus: { seats: Record<string, SeatStatus | undefined> };
  model: { data: BusModelProperties };
};

export const fallbackBusSeats = {
  leftTopSeatColumns: { seatsRows: generateSeatColumns(3, 4) },
  door: {},
  leftSeatColumns: { seatsRows: generateSeatColumns(8, 3) },
  rightSeatColumns: { seatsRows: generateSeatColumns(10, 3) },
  driver: {},
  backSeats: { seatsRows: generateSeatColumns(1, 7) },
};

/**
 * Render the bus seating interface for the provided bus identifier.
 *
 * Fetches bus seat state and model data, and renders one of:
 * - a loader while data is loading,
 * - a "Bus data not found" message when no data is returned,
 * - the seating UI wrapped with seat data provider when data is available,
 * - an error message if fetching fails.
 *
 * @param busId - The identifier of the bus to load seating data for
 * @returns A React element that displays the loader, an error message, a not-found message, or the bus seating UI populated with fetched data
 */
export function Bus({ busId }: { busId: string }) {
  const { data: busSeats, isLoading } = useQuery({
    queryKey: ["busSeats", busId],
    queryFn: () =>
      fetch(`/api/bus/${busId}`).then(
        (res) => res.json() as Promise<{ success: boolean; data: BusData }>,
      ),
  });
  try {
    if (isLoading) {
      //TODO : fix add different loader
      return <Loader />;
    }
    // console.log(busSeats.data.model);
    if (!busSeats?.data) {
      return <div>Bus data not found</div>;
    }
    return (
      <SeatsDataProvider data={busSeats.data.bus.seats}>
        <BusWrapper busId={busId} busSeats={busSeats.data.model.data} />
      </SeatsDataProvider>
    );
  } catch (error) {
    console.error("Error fetching bus seats:", error);
    return (
      <>
        <h2>Error fetching bus seats</h2>
      </>
    );
  }
}
