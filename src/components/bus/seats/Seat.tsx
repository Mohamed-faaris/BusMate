type SeatProps = {
  state?:
    | "selected"
    | "maleBooked"
    | "femaleBooked"
    | "available"
    | "invisible";
    seatId?: string;
};

export default function Seat({ state = "available",seatId = "d3" }: SeatProps) {
  let colorClass = "";
  if (state === "selected") {
    colorClass = "bg-selected";
  } else if (state === "maleBooked") {
    colorClass = "bg-maleBooked";
  } else if (state === "femaleBooked") {
    colorClass = "bg-femaleBooked";
  } else if (state === "invisible") {
    return <div className="hidden h-10 w-10"></div>;
  }
  return (
    <div
      className={`border-accent hover:bg-secondary m-0.5 flex h-10 w-10 flex-col justify-center rounded-md border text-center ${colorClass}`}
    >
      {seatId}
    </div>
  );
}
