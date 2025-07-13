
import Seat2 from "./seats/Seat2";
import Seat3 from "./seats/Seat3";

export default function Bus(){
    return (
        <div className= "flex gap-1">
        <Seat2/> <Seat3/>
        </div>
    );
}