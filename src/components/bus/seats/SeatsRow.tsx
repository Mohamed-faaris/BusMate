import { cn } from "@/lib/utils";
import Seat from "./Seat";

export default function SeatsRow({
  noOfSeatsInRow,
  fullSize,
  reversed = false,
}: {
  noOfSeatsInRow: number;
  fullSize?: number;
  reversed?: boolean;
}) {
  return (
    <div className={cn("flex flex-row justify-between", reversed ? "flex-row-reverse" : ""  )}>
      {Array.from({ length: noOfSeatsInRow }).map((_, seatIndex) => (
        <Seat key={seatIndex} />
      ))}
    </div>
  );
}
