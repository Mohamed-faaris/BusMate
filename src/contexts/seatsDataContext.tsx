import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Seat } from "@/server/db/schema/models";

type SeatsData = Seat[];

const SeatsDataContext = createContext<Seat[] | undefined>(undefined);

export const useSeatsData = () => {
  const context = useContext(SeatsDataContext);
  if (context === undefined) {
    throw new Error("useSeatsData must be used within a SeatsDataProvider");
  }
  return context;
};

export const SeatsDataProvider = ({
  data,
  children,
}: {
  data: Seat[];
  children: ReactNode;
}) => (
  <SeatsDataContext.Provider value={data}>{children}</SeatsDataContext.Provider>
);
