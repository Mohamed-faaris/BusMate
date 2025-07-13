import React from "react";
import Seat from "../seats/Seat";

interface RightSeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  noOfSeatsInRow?: number;
  noOfRows?: number;
}
export default function RightSeatColumns({
  noOfSeatsInRow = 3,
  noOfRows = 10,
  id,
  className,
  ...divProps
}: RightSeatColumnsProps) {
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
