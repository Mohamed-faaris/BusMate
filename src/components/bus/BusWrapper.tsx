import type { BusModelProperties, SeatColumns } from "@/server/db/schema";
import { Card } from "../ui/card";
import Door from "./busComponents/Door";
import Driver from "./busComponents/Driver";
import SeatGroup from "./busComponents/SeatGroup";

type BusWrapperProps = {
  busId: string;
};

const generateSeatColumns= (rows: number, cols: number) => {
  const columns: any = {};
  for (let c = 1; c <= cols; c++) {
    columns[`col${c}`] = [];
    for (let r = 1; r <= rows; r++) {
      columns[`col${c}`].push({ seatNumber: `${c}-${r}` });
    }
  }
  return columns;
};

const busSeats: BusModelProperties = {
  leftTopSeatColumns: generateSeatColumns(3, 1),
  door: {},
  leftSeatColumns: generateSeatColumns(8, 2),
  rightSeatColumns: generateSeatColumns(10, 2),
  driver: {},
  backSeats: generateSeatColumns(1, 5),
};

export default function BusWrapper({ busId }: BusWrapperProps) {
  return (
    <Card id="bus" className="gap-0 rounded-lg p-4">
      <div className="flex">
        <div id="left" className="flex flex-col">
          <SeatGroup {...busSeats.leftTopSeatColumns} />
          {/* <LeftTopSeatColumns /> */}
          <Door />
          <SeatGroup {...busSeats.leftSeatColumns} />
          {/* <LeftSeatColumns /> */}
        </div>
        <div
          id="middle"
          className="text-secondary flex flex-grow flex-col items-center justify-center [letter-spacing:1em] [text-orientation:upright] [writing-mode:vertical-rl]"
        >
          AISLE
        </div>
        <div id="right" className="flex flex-col">
          <Driver />
          <SeatGroup {...busSeats.rightSeatColumns} />
          {/* <RightSeatColumns /> */}
        </div>
      </div>
      <SeatGroup {...busSeats.backSeats} />
      {/* <BackSeats /> */}
    </Card>
  );
}
