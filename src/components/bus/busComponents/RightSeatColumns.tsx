import React from "react";
import { cn, extendArray } from "@/lib/utils";
import Seat from "../seats/Seat";
import SeatsRow from "../seats/SeatsRow";

interface RightSeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  noOfSeatsInRow?: number;
  noOfRows?: number;
  /** Optional height in px */
  height?: number;
  startingSeatNumbers?: number[];
}
export default function RightSeatColumns({
  noOfSeatsInRow = 3,
  noOfRows = 10,
  height,
  id,
  className,
  startingSeatNumbers = [1, 2],
  ...divProps
}: RightSeatColumnsProps) {
  const seatArray = extendArray(startingSeatNumbers, noOfRows, noOfSeatsInRow);
  console.log("RightSeatColumns", seatArray);
  return (
    <div
      id={id}
      style={{ height }}
      className={cn("flex flex-grow flex-col justify-around", className)}
      {...divProps}
    >
      {seatArray.map((seats, rowIndex) => (
        <SeatsRow key={rowIndex} noOfSeatsInRow={seats} fullSize={noOfSeatsInRow} reversed={true} />
      ))}
    </div>
  );
}
