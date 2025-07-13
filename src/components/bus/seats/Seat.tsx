type SeatProps = {
    state?: "selected"|"maleBooked"|"femaleBooked"|"available"|"invisible";
}

export default function Seat({ state = "available" }: SeatProps) {
    let colorClass;
    if(state === "selected") {
        colorClass = "bg-selected";
    }
    else if(state === "maleBooked") {
        colorClass = "bg-maleBooked";
    }
    else if(state === "femaleBooked") {
        colorClass = "bg-femaleBooked";
    }
    else if(state === "invisible") {
        return <div className="w-10 h-10 hidden"></div>;
    }
    return (
     <div className={`border-accent hover:bg-secondary h-10 w-10 rounded-md border ${colorClass}`}></div>
   );
}