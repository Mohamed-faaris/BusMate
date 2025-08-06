import { cn } from "@/lib/utils";
import Seat from "./Seat";
import { SeatRows } from "@/server/db/schema";

interface SeatsRowProps {
  seatRow: SeatRows;
  fullSize?: number;
  reversed?: boolean;
}

export default function SeatsRowProps({
  seatRow,
  fullSize,
  reversed = false,
}: SeatsRowProps) {
  return (
    <div
      className={cn(
        "flex flex-row justify-between",
        reversed ? "flex-row-reverse" : "",
      )}
    >
      {seatRow.map((seat, seatIndex) => (
        <Seat key={seatIndex} {...seat} />
      ))}
    </div>
  );}
