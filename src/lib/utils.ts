/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import type { BusModelProperties, Seat, SeatRows } from "@/server/db/schema";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
// Converts an array of seats to an object mapping seat id to seatStatus
export function seatsArrayToMap(
  seats: Seat[],
): Record<string, Seat["seatStatus"]> {
  return seats.reduce(
    (acc, seat) => {
      acc[seat.id] = seat.seatStatus;
      return acc;
    },
    {} as Record<string, Seat["seatStatus"]>,
  );
}
export function flattenBusSeats(busSeats: BusModelProperties): Seat[] {
  const seats: Seat[] = [];
  const seatGroups = [
    busSeats.leftTopSeatColumns,
    busSeats.leftSeatColumns,
    busSeats.rightSeatColumns,
    busSeats.backSeats,
  ];
  for (const group of seatGroups) {
    if (group && Array.isArray(group.seatsRows)) {
      for (const row of group.seatsRows) {
        if (Array.isArray(row)) {
          seats.push(...row);
        } else {
          seats.push(row);
        }
      }
    }
  }
  return seats;
}

export function generateSeatColumns(
  columns: number,
  rows: number,
  startColumnLetter = "A",
  prefix = "-",
): SeatRows[] {
  const seatColumns: SeatRows[] = [];
  for (let c = 1; c <= columns; c++) {
    const colLetter = String.fromCharCode(
      startColumnLetter.charCodeAt(0) + c - 1,
    ); // Start from the given letter
    const seatRow: Seat[] = [];
    for (let r = 1; r <= rows; r++) {
      seatRow.push({
        id: `${prefix}${colLetter}${r}`,
        seatStatus: "available",
      });
    }
    seatColumns.push(seatRow);
  }
  return seatColumns;
}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev = process.env.NODE_ENV === "development";

 
export const extendArray = (arr: unknown[], len: number, val: unknown): unknown[] => [
  ...arr,
  ...Array(Math.max(len - arr.length, 0)).fill(val),
];

// Utility function to safely stringify objects for logging
export function safeStringify(obj: unknown, space?: number): string {
  try {
    return JSON.stringify(
      obj,
      (key, value) => {
        // Handle circular references
        if (typeof value === "object" && value !== null) {
          if (value.constructor === Object || Array.isArray(value)) {
            return value;
          }
          return "[Object]";
        }
        return value;
      },
      space,
    );
  } catch {
    return String(obj);
  }
}

// Utility function to mask sensitive data in logs
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
export function maskSensitiveData(obj: any): any {
  const sensitiveKeys = [
    "password",
    "token",
    "secret",
    "key",
    "auth",
    "authorization",
  ];

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const masked = { ...obj };

  for (const key in masked) {
    if (
      sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))
    ) {
      masked[key] = "***MASKED***";
    } else if (typeof masked[key] === "object") {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }

  return masked;
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

// Utility function to format file sizes
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
