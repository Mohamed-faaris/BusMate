import { cn } from "@/lib/utils";
import { type SeatColumns } from "@/server/db/schema";
import SeatsRow from "../seats/SeatsRow";

interface SeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
    seatColumns: SeatColumns;
    reverse?: boolean;
    maxSeatsInRow:number
}
export default function SeatGroup({ seatColumns, className, reverse, maxSeatsInRow, ...divProps }: SeatColumnsProps) {
  return (
    <div className={cn("flex flex-grow flex-col justify-around", className)}
      {...divProps}>
        {seatColumns.seatIds.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
            <SeatsRow seatRow={row}  reversed={reverse} maxSeatsInRow={maxSeatsInRow}/>
            </div>
        ))}
    </div>
  );
}
