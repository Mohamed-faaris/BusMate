import { Card } from "../ui/card";
import BackSeats from "./busComponents/BackSeats";
import Door from "./busComponents/Door";
import Driver from "./busComponents/Driver";
import LeftSeatColumns from "./busComponents/LeftSeatColumns";
import LeftTopSeatColumns from "./busComponents/LeftTopColumns";
import RightSeatColumns from "./busComponents/RightSeatColumns";

type BusWrapperProps = {
  busId: string;
};

export default function BusWrapper() {
  return (
    <Card id="bus" className="rounded-lg p-4 gap-0">
      <div className="flex">
        <div id="left" className="flex flex-col">
          <LeftTopSeatColumns />
          <Door />
          <LeftSeatColumns />
        </div>
        <div
          id="middle"
          className="flex-grow text-center [letter-spacing:1em] [text-orientation:upright] [writing-mode:vertical-rl]"
        >
          {/* AISLE */}
        </div>
        <div id="right" className="flex flex-col">
          <Driver />
          <RightSeatColumns noOfRows={13} />
        </div>
      </div>
      <BackSeats />
    </Card>
  );
}
