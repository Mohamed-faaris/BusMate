import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev = process.env.NODE_ENV === "development";

export const extendArray = (arr, len, val) => [
  ...arr,
  ...Array(Math.max(len - arr.length, 0)).fill(val),
];


// Utility function to safely stringify objects for logging
export function safeStringify(obj: any, space?: number): string {
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
  } catch (error) {
    return String(obj);
  }
}

// Utility function to mask sensitive data in logs
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

// Utility function to format file sizes
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
