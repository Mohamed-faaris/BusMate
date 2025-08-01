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

type BusModelProperties = {
  leftTopSeatColumns?:{
    noOfRows ?: number;
    numberOfSeats?: number;
    height?: string;
    startingSeatNumbers?: number[];
  };
  door: {
    height?: string;
  };
  leftSeatColumns: {
    noOfRows?: number;
    numberOfSeats?: number;
    height?: string;
    startingSeatNumbers?: number[];
  };
  driver?: {
    height?: string;
  };
  rightSeatColumns: {
    noOfRows?: number;
    numberOfSeats?: number;
    height?: string;
    startingSeatNumbers?: number[];
  };
  backSeats: {
    noOfRows?: number;
    numberOfSeats?: number;
    height?: string;
  };
}

export default function BusWrapper() {
  return (
    <Card id="bus" className="gap-0 rounded-lg p-4">
      <div className="flex">
        <div id="left" className="flex flex-col">
          <LeftTopSeatColumns />
          <Door />
          <LeftSeatColumns />
        </div>
        <div
          id="middle"
          className="text-secondary flex flex-grow flex-col items-center justify-center [letter-spacing:1em] [text-orientation:upright] [writing-mode:vertical-rl]"
        >
          AISLE
        </div>
        <div id="right" className="flex flex-col">
          <Driver />
          <RightSeatColumns noOfRows={10} />
        </div>
      </div>
      <BackSeats />
    </Card>
  );
}
