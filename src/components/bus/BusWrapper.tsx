"use client";
import type { BusModelProperties, Seat, SeatRows } from "@/server/db/schema";
import { Card } from "../ui/card";
import Door from "./busComponents/Door";
import Driver from "./busComponents/Driver";
import SeatGroup from "./busComponents/SeatGroup";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useSeat } from "@/contexts/BusPropsContext";

type BusWrapperProps = {
  busId: string;
  busSeats: BusModelProperties;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function BusWrapper({
  busId,
  busSeats,
  className,
  ...props
}: BusWrapperProps) {
  const { scale } = useSeat();
  return (
    <Card
      id="bus"
      className={cn("h-min gap-0 rounded-lg p-4", className)}
      {...props}
    >
      <div className="flex">
        <div id="left" className="flex flex-col">
          <SeatGroup
            seatGroups={busSeats.leftTopSeatColumns.seatsRows}
            maxSeatsInRow={busSeats.leftTopSeatColumns.seatsPerRow || 2}
            height={busSeats?.leftTopSeatColumns?.height}
          />
          {/* <LeftTopSeatColumns /> */}
          <Door height={busSeats?.door?.height} />
          <SeatGroup
            seatGroups={busSeats.leftSeatColumns.seatsRows}
            maxSeatsInRow={busSeats.leftSeatColumns.seatsPerRow || 2}
            height={busSeats?.leftSeatColumns?.height}
          />
          {/* <LeftSeatColumns /> */}
        </div>
        <div
          id="middle"
          style={{ fontSize: 14 * scale }}
          className="text-secondary flex flex-grow flex-col items-center justify-center [letter-spacing:1em] [text-orientation:upright] [writing-mode:vertical-rl]"
        >
          AISLE
        </div>
        <div id="right" className="flex flex-col">
          <Driver height={busSeats?.driver?.height} />
          <SeatGroup
            seatGroups={busSeats.rightSeatColumns.seatsRows}
            maxSeatsInRow={busSeats.rightSeatColumns.seatsPerRow || 3}
            height={busSeats?.rightSeatColumns?.height}
            reversed={true}
          />
          {/* <RightSeatColumns /> */}
        </div>
      </div>
      <SeatGroup
        seatGroups={busSeats.backSeats.seatsRows}
        maxSeatsInRow={busSeats.backSeats.seatsPerRow || 7}
        height={busSeats?.backSeats?.height}
      />
      {/* <BackSeats /> */}
    </Card>
  );
}
