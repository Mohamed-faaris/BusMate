import { cn } from "@/lib/utils";
import { type SeatRows } from "@/server/db/schema";
import SeatsRow from "../seats/SeatsRow";

interface SeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  seatGroups: SeatRows[];
  reverse?: boolean;
  maxSeatsInRow: number;
  height?: number;
}

export default function SeatGroup({
  seatGroups,
  className,
  reverse,
  maxSeatsInRow,
  height,
  ...divProps
}: SeatColumnsProps) {
  return (
    <div
      className={cn("flex flex-grow flex-col justify-around", className)}
      {...divProps}
      style={{ minHeight:height }}
    >
      {seatGroups.map((seatRow: SeatRows, rowIndex: number) => (
        <div key={rowIndex} className="flex">
          <SeatsRow
            seatRow={seatRow}
            reversed={reverse || false}
            maxSeatsInRow={maxSeatsInRow}
          />
        </div>
      ))}
    </div>
  );
}
