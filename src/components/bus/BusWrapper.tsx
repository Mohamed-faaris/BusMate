import type { Seat, SeatRows } from "@/server/db/schema";
import { Card } from "../ui/card";
import Door from "./busComponents/Door";
import Driver from "./busComponents/Driver";
import SeatGroup from "./busComponents/SeatGroup";

type BusWrapperProps = {
  busId: string;
};

import { generateSeatColumns } from "@/lib/utils";

const busSeats = {
  leftTopSeatColumns: generateSeatColumns(3, 4),
  door: {},
  leftSeatColumns: generateSeatColumns(8, 3),
  rightSeatColumns: generateSeatColumns(10, 2),
  driver: {},
  backSeats: generateSeatColumns(1, 6),
};

export default function BusWrapper({ busId }: BusWrapperProps) {
  // console.log(JSON.stringify(busSeats));
  return (
    <Card id="bus" className="gap-0 rounded-lg p-4">
      <div className="flex">
        <div id="left" className="flex flex-col">
          <SeatGroup
            seatGroups={busSeats.leftTopSeatColumns}
            maxSeatsInRow={3}
          />
          {/* <LeftTopSeatColumns /> */}
          <Door />
          <SeatGroup seatGroups={busSeats.leftSeatColumns} maxSeatsInRow={3} />
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
          <SeatGroup seatGroups={busSeats.rightSeatColumns} maxSeatsInRow={3} />
          {/* <RightSeatColumns /> */}
        </div>
      </div>
      <SeatGroup seatGroups={busSeats.backSeats} maxSeatsInRow={6} />
      {/* <BackSeats /> */}
    </Card>
  );
}
