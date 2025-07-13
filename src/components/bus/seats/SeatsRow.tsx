import Seat from "./Seat";

export default function SeatsRow({noOfSeatsInRow}: {noOfSeatsInRow: number}) {
return (
    <div className="flex">
        {Array.from({ length: noOfSeatsInRow }).map(() => (
            <Seat />
        ))}
    </div>
);
}