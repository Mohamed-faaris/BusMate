"use client";
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { Seat } from "@/server/db/schema";

interface SeatContextType {
  selectedSeat: Seat | null;
  setSelectedSeat: Dispatch<SetStateAction<Seat | null>>;
}

export const SeatContext = createContext<SeatContextType | null>(null);

export function SeatProvider({ children }: { children: ReactNode }) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  return (
    <SeatContext.Provider value={{ selectedSeat, setSelectedSeat }}>
      {children}
    </SeatContext.Provider>
  );
}

export function useSeat() {
  const context = useContext(SeatContext);
  if (!context) {
    throw new Error("useSeat must be used within a SeatProvider");
  }
  return context;
}
