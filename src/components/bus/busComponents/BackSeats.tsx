import React from "react";
import SeatsRow from "../seats/SeatsRow";

interface BackSeatsProps extends React.HTMLAttributes<HTMLDivElement> {
  noOfBackSeats?: number;
}
export default function BackSeats({
  noOfBackSeats = 5,
  id,
  className,
  ...divProps
}: BackSeatsProps) {
  return (
    <div id={id} className={className} {...divProps}>
      <SeatsRow noOfSeatsInRow={noOfBackSeats} />
    </div>
  );
}
