import type { Seat } from "@/server/db/schema";
import { useSeat } from "@/contexts/SeatContext";
import { useSeatsData } from "@/contexts/seatsDataContext";

type SeatProps = Seat;

export default function Seat({ id,seatStatus }: SeatProps) {
  const { selectedSeat, setSelectedSeat } = useSeat();
  const seatStatusFromContext = useSeatsData()[id];
  const isSelected = selectedSeat?.id === id;
  const scale = 110;

  let colorClass = "";
  if (isSelected) {
    colorClass = "bg-black";
  } else if (seatStatusFromContext === "available") {
    colorClass = "bg-available";
  } else if (seatStatusFromContext === "bookedMale") {
    colorClass = "bg-blue-500";
  } else if (seatStatusFromContext === "bookedFemale") {
    colorClass = "bg-femaleBooked";
  } else if (seatStatusFromContext === "reserved") {
    colorClass = "bg-reserved";
  } else if (seatStatus === "unavailable") {
    return <div className="hidden h-10 w-10"></div>;
  }
  return (
    <div
      onClick={() => setSelectedSeat({ id, seatStatus })}
      className={`border-accent hover:bg-secondary m-0.5 flex h-[40px] w-[40px] flex-col justify-center rounded-md border text-center ${colorClass}`}
    >
      {id.slice(-3)}
    </div>
  );
}
