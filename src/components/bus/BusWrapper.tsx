import type {
  BusModelProperties,
  Seat,
  SeatGroups,
  SeatRows,
} from "@/server/db/schema";
import { Card } from "../ui/card";
import Door from "./busComponents/Door";
import Driver from "./busComponents/Driver";
import SeatGroup from "./busComponents/SeatGroup";

type BusWrapperProps = {
  busId: string;
};

//   const generateSeatColumns: (rows: number, cols: number) => SeatGroups = (
//     rows: number,
//     cols: number,
//   ) => {
//     const columns: SeatGroups = {
//       seatIds: [],
//     };
//     for (let c = 1; c <= cols; c++) {
//       const seatRows: SeatRows = [];
//       for (let r = 1; r <= rows; r++) {
//         seatRows.push({ id: `${c}-${r}` } as Seat); // Assuming Seat interface has an id property
//       }
//       columns.seatIds.push(seatRows);
//     }
//     console.log("Generated seat columns:", columns);
//     return columns;
//   };

// const busSeats: BusModelProperties = {
//   leftTopSeatColumns: {
//     seatIds: [
//       [{ id: "1-1" }, { id: "1-2" }, { id: "1-3" }],
//       [{ id: "1-4" }, { id: "1-5" }, { id: "1-6" }],
//     ],
//   },
//   door: {},
//   leftSeatColumns: generateSeatColumns(8, 2),
//   rightSeatColumns: generateSeatColumns(10, 2),
//   driver: {},
//   backSeats: generateSeatColumns(1, 5),
// };

export default function BusWrapper({ busId }: BusWrapperProps) {
  return (
    <Card id="bus" className="gap-0 rounded-lg p-4">
      <div className="flex">
        <div id="left" className="flex flex-col">
          <SeatGroup
            seatGroups={[
              [{ id: "1-1" }, { id: "1-2" }, { id: "1-3" }] as SeatRows,
              [{ id: "1-4" }, { id: "1-5" }, { id: "1-6" }] as SeatRows,
            ] as SeatGroups}
            maxSeatsInRow={3}
          />
          {/* <LeftTopSeatColumns /> */}
          <Door />
          {/* <SeatGroup {...busSeats.leftSeatColumns} /> */}
          {/* <LeftSeatColumns /> */}
        </div>
        <div
          id="middle"
          className="text-secondary flex flex-grow flex-col items-center justify-center [letter-spacing:1em] [text-orientation:upright] [writing-mode:vertical-rl]"
        >
          AISLE
        </div>
        <div id="right" className="flex flex-col">
          <Driver />
          {/* <SeatGroup {...busSeats.rightSeatColumns} /> */}
          {/* <RightSeatColumns /> */}
        </div>
      </div>
      {/* <SeatGroup {...busSeats.backSeats} /> */}
      {/* <BackSeats /> */}
    </Card>
  );
}
