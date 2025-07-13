import Seat from "./Seat";

export default function SeatsRow({
  noOfSeatsInRow,
}: {
  noOfSeatsInRow: number;
}) {
  return (
    <div className="flex flex-row justify-between">
      {Array.from({ length: noOfSeatsInRow }).map((_, seatIndex) => (
        <Seat key={seatIndex} />
      ))}
    </div>
  );
}
