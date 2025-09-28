"use client";
import type { BusModelProperties, SeatGroups } from "@/server/db/schema";
import { Card } from "@/components/ui/card";
import Door from "@/components/bus/busComponents/Door";
import Driver from "@/components/bus/busComponents/Driver";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useSeat } from "@/contexts/BusPropsContext";
import AdminSeat from "@/components/bus/seats/AdminSeat";

type SeatBookingInfo = {
  seatId: string;
  status: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  userRollNo: string | null;
  userGender: string | null;
  createdAt: Date | null;
};

type AdminBusWrapperProps = {
  busId: string;
  busSeats: BusModelProperties;
  seatBookings: SeatBookingInfo[];
  busSeatStatuses: Record<string, string>; // Add seat statuses from bus data
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

// Helper component to render seat groups with booking info
function AdminSeatGroup({
  seatGroups,
  maxSeatsInRow,
  height: _height,
  seatBookings,
  busSeatStatuses,
}: {
  seatGroups: SeatGroups[];
  maxSeatsInRow: number;
  height?: number;
  seatBookings: SeatBookingInfo[];
  busSeatStatuses: Record<string, string>;
}) {
  useSeat();

  return (
    <div className="flex flex-col">
      {seatGroups.map((seatRow, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: maxSeatsInRow }).map((_, seatIndex) => {
            const seat = seatRow[seatIndex];
            if (!seat) {
              return <div key={seatIndex} className="m-0.5 h-10 w-10" />;
            }

            // Get seat status from bus data and booking info
            const actualSeatStatus =
              busSeatStatuses[seat.id] ?? seat.seatStatus;
            const bookingInfo = seatBookings.find(
              (booking) => booking.seatId === seat.id,
            );

            return (
              <AdminSeat
                key={seat.id}
                id={seat.id}
                seatStatus={actualSeatStatus}
                bookingInfo={bookingInfo}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function AdminBusWrapper({
  busId: _busId,
  busSeats,
  seatBookings,
  busSeatStatuses,
  className,
  ...props
}: AdminBusWrapperProps) {
  useSeat();

  return (
    <Card
      id="admin-bus"
      className={cn("h-min gap-0 rounded-lg p-4", className)}
      {...props}
    >
      <div className="flex justify-center">
        <div id="left" className="flex flex-col">
          <AdminSeatGroup
            seatGroups={busSeats.leftTopSeatColumns.seatsRows}
            maxSeatsInRow={busSeats.leftTopSeatColumns.seatsPerRow || 2}
            height={busSeats?.leftTopSeatColumns?.height}
            seatBookings={seatBookings}
            busSeatStatuses={busSeatStatuses}
          />
          <Door height={busSeats?.door?.height} />
          <AdminSeatGroup
            seatGroups={busSeats.leftSeatColumns.seatsRows}
            maxSeatsInRow={busSeats.leftSeatColumns.seatsPerRow || 2}
            height={busSeats?.leftSeatColumns?.height}
            seatBookings={seatBookings}
            busSeatStatuses={busSeatStatuses}
          />
        </div>
        <div
          id="middle"
          className="text-secondary flex w-10 flex-col items-center justify-center text-sm [letter-spacing:1em] [text-orientation:upright] [writing-mode:vertical-rl]"
        >
          AISLE
        </div>
        <div id="right" className="flex flex-col">
          <Driver height={busSeats?.driver?.height} />
          <AdminSeatGroup
            seatGroups={busSeats.rightSeatColumns.seatsRows}
            maxSeatsInRow={busSeats.rightSeatColumns.seatsPerRow || 3}
            height={busSeats?.rightSeatColumns?.height}
            seatBookings={seatBookings}
            busSeatStatuses={busSeatStatuses}
          />
        </div>
      </div>
      {/* Back Seats - Centered */}
      <div className="mt-2 ml-10 flex justify-center">
        <AdminSeatGroup
          seatGroups={busSeats.backSeats.seatsRows}
          maxSeatsInRow={busSeats.backSeats.seatsPerRow || 7}
          height={busSeats?.backSeats?.height}
          seatBookings={seatBookings}
          busSeatStatuses={busSeatStatuses}
        />
      </div>
    </Card>
  );
}
