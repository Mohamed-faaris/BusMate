"use client";
import React from "react";
import BusWrapper from "./BusWrapper";

import { generateSeatColumns } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { is } from "drizzle-orm";
import { Loader } from "lucide-react";

const fallbackBusSeats = {
  leftTopSeatColumns: { seatsRows: generateSeatColumns(3, 4) },
  door: {},
  leftSeatColumns: { seatsRows: generateSeatColumns(8, 3) },
  rightSeatColumns: { seatsRows: generateSeatColumns(10, 2) },
  driver: {},
  backSeats: { seatsRows: generateSeatColumns(1, 6) },
};

export default function Bus({ busId }: { busId: string }) {
  const { data: busSeats, isLoading } = useQuery({
    queryKey: ["busSeats", busId],
    queryFn: () => fetch(`/api/bus/${busId}`).then((res) => res.json()),
   
  });
  try{
    if(isLoading){
      //TODO : fix add different loader
      return <Loader />;
    }
    return (
      <>
        <BusWrapper busId={busId} busSeats={busSeats.data.model.data} />
      </>
    );

  }
  catch (error) {
    console.error("Error fetching bus seats:", error);
    return (
      <>
        <h2>Error fetching bus seats</h2>
      </>
    );
  }
}
