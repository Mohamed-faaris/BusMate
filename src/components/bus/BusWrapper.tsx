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
    <div id="bus">
      <div className="flex">
        <div id="left">
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
          <RightSeatColumns />
        </div>
      </div>
      <BackSeats />
    </div>
  );
}
