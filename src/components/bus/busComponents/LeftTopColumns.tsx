import React from "react";
import { cn, extendArray } from "@/lib/utils";
import Seat from "../seats/Seat";
import SeatsRow from "../seats/SeatsRow";

interface LeftTopSeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  noOfSeatsInRow?: number;
  noOfRows?: number;
  /** Optional height in px */
  height?: number;
  startingSeatNumbers?: number[];
}
export default function LeftTopSeatColumns({
  noOfSeatsInRow = 2,
  noOfRows = 3,
  height,
  startingSeatNumbers = [1, 2],
  id,
  className,
  ...divProps
}: LeftTopSeatColumnsProps) {
  const seatArray = extendArray(startingSeatNumbers, noOfRows, noOfSeatsInRow);
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
