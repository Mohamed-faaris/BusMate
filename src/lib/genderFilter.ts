import type { Seat,BusModelProperties } from "../server/db/schema/models";

export const genderFilter = (maxRowIncluded = 2, gender: "male" | "female", seats: Record<string, Seat["seatStatus"]>, modelData: BusModelProperties): string[] => {
    const availableSeats: string[] = [];
    if (gender === "male") {
        //include all available seats in back seats
        for (const seatRows of modelData.backSeats.seatsRows) {
            for (const seat of seatRows) {
                if (seats[seat.id] === "available") {
                    availableSeats.push(seat.id);
                }
            }
        }

        let rowsIncluded = 0;
        const boysSeatGroups = [modelData.leftSeatColumns, modelData.rightSeatColumns];
        for (const seatGroup of boysSeatGroups) {
            for (let i = seatGroup.seatsRows.length; i >= 0 && rowsIncluded < maxRowIncluded; i--) {
                const seatRows = seatGroup.seatsRows[i]!;
                let isFemaleRow = false;
                for (const seat of seatRows) {
                    if (seats[seat.id] === "bookedFemale") {
                        isFemaleRow = true;
                        break;
                    }
                }
                if (isFemaleRow) break;
                for (const seat of seatRows) {
                    let isFullRow = true;
                    if (seats[seat.id] === "available") {
                        availableSeats.push(seat.id);
                        if (isFullRow) {
                            isFullRow = false;
                            rowsIncluded++;
                        }
                    }
                }
            }
        }
    
    }else if(gender === "female"){
        //include all available seats in left top seats
        for (const seatRows of modelData.leftTopSeatColumns.seatsRows) {
            for (const seat of seatRows) {
                if (seats[seat.id] === "available") {
                    availableSeats.push(seat.id);
                }
            }
        }

        let rowsIncluded = 0;
        const boysSeatGroups = [modelData.leftSeatColumns, modelData.rightSeatColumns];
        for (const seatGroup of boysSeatGroups) {
            for (let i = 0; i < seatGroup.seatsRows.length && rowsIncluded < maxRowIncluded; i++) {
                const seatRows = seatGroup.seatsRows[i]!;
                let isMaleRow = false;
                for (const seat of seatRows) {
                    if (seats[seat.id] === "bookedMale") {
                        isMaleRow = true;
                        break;
                    }
                }
                if (isMaleRow) break;
                for (const seat of seatRows) {
                    let isFullRow = true;
                    if (seats[seat.id] === "available") {
                        availableSeats.push(seat.id);
                        if (isFullRow) {
                            isFullRow = false;
                            rowsIncluded++;
                        }
                    }
                }
            }
        }
    }
    console.log("Available Seats for ", gender, ": ", availableSeats);
    return availableSeats;
}


