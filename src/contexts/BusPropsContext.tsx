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

interface BusPropsType {
  selectedSeat: Seat | null;
  setSelectedSeat: Dispatch<SetStateAction<Seat | null>>;
  scale: number;
  state: string;
  enabled?: boolean;
}

export const SeatContext = createContext<BusPropsType | null>(null);

export function BusPropsProvider({
  scale = 1,
  state = "selected",
  disabled,
  children,
}: {
  scale?: number;
  state?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  return (
    <SeatContext.Provider
      value={{ selectedSeat, setSelectedSeat, state, scale, enabled: disabled }}
    >
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
