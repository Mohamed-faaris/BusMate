import React from "react";
import SeatsRow from "../seats/SeatsRow";
import { cn } from "@/lib/utils";

interface BackSeatsProps extends React.HTMLAttributes<HTMLDivElement> {
  noOfBackSeats?: number;
}
export default function BackSeats({
  noOfBackSeats = 6,
  id,
  className,
  ...divProps
}: BackSeatsProps) {
  return (
    <div id={id} className={cn("w-full", className)} {...divProps}>
      <SeatsRow noOfSeatsInRow={noOfBackSeats} />
    </div>
  );
}
