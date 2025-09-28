"use client";
import React from "react";
import BusWrapper from "./BusWrapper";

import { generateSeatColumns } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { SeatsDataProvider } from "@/contexts/seatsDataContext";

export const fallbackBusSeats = {
  leftTopSeatColumns: { seatsRows: generateSeatColumns(3, 4) },
  door: {},
  leftSeatColumns: { seatsRows: generateSeatColumns(8, 3) },
  rightSeatColumns: { seatsRows: generateSeatColumns(10, 3) },
  driver: {},
  backSeats: { seatsRows: generateSeatColumns(1, 7) },
};

export function Bus({ busId }: { busId: string }) {
  const { data: busSeats, isLoading } = useQuery({
    queryKey: ["busSeats", busId],
    queryFn: () => fetch(`/api/bus/${busId}`).then((res) => res.json()),
  });
  try {
    if (isLoading) {
      //TODO : fix add different loader
      return <Loader />;
    }
    // console.log(busSeats.data.model);
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
