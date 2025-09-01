import type { Seat } from "@/server/db/schema";
import { useSeat } from "@/contexts/BusPropsContext";
import { useSeatsData } from "@/contexts/seatsDataContext";

type SeatProps = Seat;

export default function Seat({ id, seatStatus }: SeatProps) {
  const { selectedSeat, setSelectedSeat } = useSeat();
  const seatStatusFromContext = useSeatsData()[id];
  const isSelected = selectedSeat?.id === id;
  const { scale, enabled: disabled } = useSeat();

  let colorClass = "bg-available";

  if (seatStatusFromContext === "bookedMale") {
    colorClass = "bg-maleBooked";
  } else if (seatStatusFromContext === "bookedFemale") {
    colorClass = "bg-femaleBooked";
  } else if (seatStatusFromContext === "reserved") {
    colorClass = "bg-reserved";
  } else if (seatStatus === "unavailable") {
    return (
      <div
        style={{ height: 40 * scale, width: 40 * scale }}
        className={`hidden`}
      ></div>
    );
  } else if (isSelected) {
    colorClass = "bg-selected";
  }
  return (
    <div
      onClick={() => {
        if (!disabled && colorClass === "bg-available") {
          setSelectedSeat({ id, seatStatus });
        }
      }}
      style={{ height: 40 * scale, width: 40 * scale, fontSize: 14 * scale }}
      className={`border-accent ${colorClass === "bg-available" ? "hover:bg-secondary" : ""} m-0.5 flex flex-col justify-center rounded-md border text-center ${colorClass}`}
    >
      {id.slice(-3)}
    </div>
  );
}
