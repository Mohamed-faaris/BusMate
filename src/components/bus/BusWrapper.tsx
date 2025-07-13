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
        <div id="middle" className="w-2"></div>
        <div id="right">
          <Driver />
          <RightSeatColumns />
        </div>
      </div>
      <BackSeats />
    </div>
  );
}
