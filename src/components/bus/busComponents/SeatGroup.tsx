import { cn } from "@/lib/utils";
import { type SeatGroups } from "@/server/db/schema";
import SeatsRow from "../seats/SeatsRow";

interface SeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  seatGroups: SeatGroups;
  reverse?: boolean;
  maxSeatsInRow: number;
}
export default function SeatGroup({
  seatGroups ,
  className,
  reverse,
  maxSeatsInRow,
  ...divProps
}: SeatColumnsProps) {
  console.log(
    "SeatGroup",
    seatGroups,
    className,
    reverse,
    maxSeatsInRow,
    divProps,
  );
  return (
    <div
      className={cn("flex flex-grow flex-col justify-around", className)}
      {...divProps}
    >
      {seatGroups.seatsRows.map((seatRow, rowIndex) => (
        <div key={rowIndex} className="flex">
          <SeatsRow
            seatRow={seatRow}
            reversed={reverse}
            maxSeatsInRow={maxSeatsInRow}
          />
        </div>
      ))}
    </div>
  );
}
