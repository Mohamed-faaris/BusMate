import React from "react";
import { cn } from "@/lib/utils";
import Seat from "../seats/Seat";

interface LeftTopSeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  noOfSeatsInRow?: number;
  noOfRows?: number;
  /** Optional height in px */
  height?: number;
}
export default function LeftTopSeatColumns({
  noOfSeatsInRow = 2,
  noOfRows = 3,
  height,
  id,
  className,
  ...divProps
}: LeftTopSeatColumnsProps) {
  return (
    <div
      id={id}
      style={{ height } }
      className={cn("flex flex-grow flex-col justify-around", className)}
      {...divProps}
    >
      {Array.from({ length: noOfRows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: noOfSeatsInRow }).map((_, seatIndex) => (
            <Seat key={seatIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}
