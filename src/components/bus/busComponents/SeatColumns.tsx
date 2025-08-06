import { cn } from "@/lib/utils";
import { SeatColumns } from "@/server/db/schema";
import Seat from "../seats/Seat";
import SeatsRow from "../seats/SeatsRow";

interface SeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
    seatColumns: SeatColumns;
}
export default function SeatColumns({ seatColumns, className, ...divProps }: SeatColumnsProps) {
  return (
    <div className={cn("flex flex-grow flex-col justify-around", className)}
      {...divProps}>
        {seatColumns.seatIds.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
            <SeatsRow seatRow={row} />
            </div>
        ))}
    </div>
  );
}
