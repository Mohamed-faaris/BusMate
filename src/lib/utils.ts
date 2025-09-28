/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import type { BusModelProperties, Seat, SeatRows } from "@/server/db/schema";

/**
 * Generates a 6-digit numeric one-time password (OTP) as a string.
 *
 * @returns A string containing a random 6-digit numeric OTP between "100000" and "999999".
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
/**
 * Create a mapping from seat IDs to their seat status.
 *
 * @param seats - Array of Seat objects to convert
 * @returns An object whose keys are seat `id` values and whose values are the corresponding `seatStatus`
 */
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
/**
 * Aggregate all Seat entries from a bus model's seat column and back-seat groups into a single flat array.
 *
 * Iterates the leftTopSeatColumns, leftSeatColumns, rightSeatColumns, and backSeats groups (in that order),
 * collecting each group's rows and flattening any row arrays into a single list. Missing groups or groups
 * without an array `seatsRows` are ignored.
 *
 * @param busSeats - Bus model containing grouped seat columns and back seats
 * @returns An array of `Seat` objects aggregated from the bus's seat groups in traversal order
 */
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

/**
 * Produces a safe JSON representation of a value for logging.
 *
 * Uses JSON.stringify while preserving plain objects and arrays, replacing non-plain objects (e.g., class instances) with the string "[Object]" to avoid serialization issues and to reduce noise. If serialization fails, falls back to String(obj).
 *
 * @param obj - The value to stringify
 * @param space - Optional number of spaces for indentation in the output
 * @returns A JSON string representation of `obj`, or `String(obj)` if serialization fails
 */
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
/**
 * Recursively masks values of object properties whose keys indicate sensitive information.
 *
 * Sensitive keys are any property names that (case-insensitively) include the substrings:
 * "password", "token", "secret", "key", "auth", or "authorization". Matching properties are
 * replaced with the literal string "***MASKED***". Non-object inputs are returned unchanged.
 *
 * @param obj - The value to sanitize; when an object, a shallow copy with masked sensitive fields is returned, with nested objects processed recursively.
 * @returns The sanitized value: an object with sensitive fields replaced by `"***MASKED***"`, or the original non-object value.
 */
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

/**
 * Format a byte count into a human-readable size string with an appropriate unit.
 *
 * @param bytes - The size in bytes to format.
 * @param decimals - Number of decimal places to include; defaults to 2 and treated as 0 if negative.
 * @returns The formatted size (e.g., "0 Bytes", "1.23 MB").
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
