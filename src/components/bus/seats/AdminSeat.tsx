"use client";
import type { Seat } from "@/server/db/schema";
import { useSeat } from "@/contexts/BusPropsContext";
import { useState } from "react";

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

type AdminSeatProps = Seat & {
  bookingInfo?: SeatBookingInfo;
};

/**
 * Renders a seat tile with a status-based color and an optional hover tooltip showing booking details.
 *
 * When `seatStatus` is "unavailable", the component renders a small empty placeholder and does not render a tooltip.
 *
 * @param id - Unique seat identifier; the last three characters are shown on the tile
 * @param seatStatus - One of the seat status values ("available", "bookedMale", "bookedFemale", "reserved", "unavailable") that determines the tile color and rendering behavior
 * @param bookingInfo - Optional booking metadata; when present and contains `userId`, a compact tooltip with user details is shown on hover
 * @returns A JSX element representing the seat tile; when hovered, it may show either a compact booking tooltip or a simple "Available" tooltip
 */
export default function AdminSeat({
  id,
  seatStatus,
  bookingInfo,
}: AdminSeatProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  useSeat();

  let colorClass = "bg-available";

  // Use the actual seat status to determine color
  if (seatStatus === "bookedMale") {
    colorClass = "bg-maleBooked";
  } else if (seatStatus === "bookedFemale") {
    colorClass = "bg-femaleBooked";
  } else if (seatStatus === "reserved") {
    colorClass = "bg-reserved";
  } else if (seatStatus === "unavailable") {
    return <div className="m-0.5 h-10 w-10" />;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`border-accent m-0.5 flex h-10 w-10 cursor-default items-center justify-center rounded border text-xs font-semibold ${colorClass}`}
      >
        {id.slice(-3)}
      </div>

      {/* Compact Tooltip */}
      {showTooltip && bookingInfo?.userId && (
        <div className="bg-card border-border absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 transform rounded border p-2 text-xs shadow-lg">
          <div className="space-y-1">
            <div className="text-card-foreground font-semibold">
              {bookingInfo.userName} ({bookingInfo.seatId})
            </div>
            <div className="text-muted-foreground">
              Roll: {bookingInfo.userRollNo} | {bookingInfo.userGender}
            </div>
            <div className="text-muted-foreground truncate">
              {bookingInfo.userPhone}
            </div>
          </div>
          <div className="border-t-card absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-r-transparent border-l-transparent"></div>
        </div>
      )}

      {/* Simple Available Tooltip */}
      {showTooltip && !bookingInfo?.userId && (
        <div className="bg-card border-border absolute bottom-full left-1/2 z-10 mb-2 w-24 -translate-x-1/2 transform rounded border p-1 text-center text-xs shadow-lg">
          <div className="text-card-foreground">{id} - Available</div>
          <div className="border-t-card absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-r-transparent border-l-transparent"></div>
        </div>
      )}
    </div>
  );
}
