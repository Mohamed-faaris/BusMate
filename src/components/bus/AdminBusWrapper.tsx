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

/**
 * Render a vertical stack of seat rows that map seats to AdminSeat components with booking and status data.
 *
 * @param seatGroups - Array of seat rows to render; each row contains seat entries for layout.
 * @param maxSeatsInRow - Number of seat positions to reserve per row (empty positions render placeholders).
 * @param height - Optional fixed height for the group (when provided by parent layout).
 * @param seatBookings - Booking records used to attach booking information to matching seats.
 * @param busSeatStatuses - Map of seatId to status string used to override a seat's default status.
 * @returns A JSX element containing the arranged seat rows and placeholders as the seat group layout.
 */
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
      {/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
      {seatGroups.map((seatRow, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: maxSeatsInRow }).map((_, seatIndex) => {
            const seat = (seatRow as Seat[])[seatIndex];
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
      {/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */}
    </div>
  );
}

/**
 * Render an administrative bus layout including seat groups, driver, door, and aisle label.
 *
 * @param busId - The bus identifier (renamed to `_busId` in the component props and unused at render time)
 * @param busSeats - Configuration describing seat groups, counts per row, and component heights for the bus layout
 * @param seatBookings - Array of booking information keyed by seat id, used to annotate seats with booking data
 * @param busSeatStatuses - Map of seat id to status string that overrides each seat's default status when present
 * @param className - Additional CSS class names applied to the root Card container
 * @returns A React element that visually composes the admin bus interface with seats, door, driver, and back-seat rows
 */
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
