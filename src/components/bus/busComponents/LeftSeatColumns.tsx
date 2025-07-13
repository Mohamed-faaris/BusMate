import React from "react";
import Seat from "../seats/Seat";

interface LeftSeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  noOfSeatsInRow?: number;
  noOfRows?: number;
}
export default function LeftSeatColumns({
  noOfSeatsInRow = 2,
  noOfRows = 7,
  id,
  className,
  ...divProps
}: LeftSeatColumnsProps) {
  return (
    <div id={id} className={className} {...divProps}>
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
