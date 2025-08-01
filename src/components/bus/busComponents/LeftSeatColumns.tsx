import React from "react";
import { cn, extendArray } from "@/lib/utils";
import Seat from "../seats/Seat";
import SeatsRow from "../seats/SeatsRow";

interface LeftSeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  noOfSeatsInRow?: number;
  noOfRows?: number;
  /** Optional height in px */
  height?: number;
  startingSeatNumbers?: number[];
}
export default function LeftSeatColumns({
  noOfSeatsInRow = 2,
  noOfRows = 7,
  startingSeatNumbers = [1, 2],
  height,
  id,
  className,
  ...divProps
}: LeftSeatColumnsProps) {
  const seatArray = extendArray(startingSeatNumbers, noOfRows , noOfSeatsInRow) 
  return (
    <div
          id={id}
          style={{ height }}
          className={cn("flex flex-grow flex-col justify-around", className)}
          {...divProps}
        >
          {seatArray.map((seats, rowIndex) => (
            <SeatsRow key={rowIndex} noOfSeatsInRow={seats} />
          ))}
        </div>
  );
}
