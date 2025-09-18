import { cn } from "@/lib/utils";
import { type SeatRows } from "@/server/db/schema";
import SeatsRow from "../seats/SeatsRow";

interface SeatColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  seatGroups: SeatRows[];
  reversed?: boolean;
  maxSeatsInRow: number;
  height?: number;
}

export default function SeatGroup({
  seatGroups,
  className,
  reversed = false,
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
            reversed={reversed}
            maxSeatsInRow={maxSeatsInRow}
          />
        </div>
      ))}
    </div>
  );
}
