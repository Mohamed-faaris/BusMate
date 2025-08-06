import type { Seat } from "@/server/db/schema";

type SeatProps = Seat;

export default function Seat({ id, seatStatus }: SeatProps) {
  let colorClass = "";
  if (seatStatus === "available") {
    colorClass = "bg-selected";
  } else if (seatStatus === "bookedMale") {
    colorClass = "bg-maleBooked";
  } else if (seatStatus === "bookedFemale") {
    colorClass = "bg-femaleBooked";
  } else if (seatStatus === "reserved") {
    colorClass = "bg-reserved";
  } else if (seatStatus === "unavailable") {
    return <div className="hidden h-10 w-10"></div>;
  }
  return (
    <div
      className={`border-accent hover:bg-secondary m-0.5 flex h-10 w-10 flex-col justify-center rounded-md border text-center ${colorClass}`}
    >
      {id.slice(-3)}
    </div>
  );
}
