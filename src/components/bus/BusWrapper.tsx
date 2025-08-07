import type { BusModelProperties } from "@/server/db/schema";
import { Card } from "../ui/card";
import BackSeats from "./busComponents/BackSeats";
import Door from "./busComponents/Door";
import Driver from "./busComponents/Driver";
import SeatColumns from "./busComponents/seatColumns";

type BusWrapperProps = {
  busId: string;
};

const busSeats:BusModelProperties = {
  leftSeatColumns:{
    
  }
}



export default function BusWrapper( { busId }: BusWrapperProps) {
  return (
    <Card id="bus" className="gap-0 rounded-lg p-4">
      <div className="flex">
        <div id="left" className="flex flex-col">
          <SeatColumns />
          {/* <LeftTopSeatColumns /> */}
          <Door />
          <SeatColumns />
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
          <SeatColumns/>
          {/* <RightSeatColumns /> */}
        </div>
      </div>
      <BackSeats />
    </Card>
  );
}
