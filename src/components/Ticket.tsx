"use client";
import { BusPropsProvider } from "@/contexts/BusPropsContext";
import { SeatsDataProvider } from "@/contexts/seatsDataContext";
import { seatsArrayToMap, flattenBusSeats, cn } from "@/lib/utils";
import Bus, { fallbackBusSeats } from "./bus/Bus";
import BusWrapper from "./bus/BusWrapper";
import { LogoTitle } from "./LogoTitle";
import { useQuery } from "@tanstack/react-query";
import type { DashboardApiResponseSuccess } from "@/app/api/dashboard/route";
import { useSession } from "next-auth/react";

interface TicketProps extends React.HTMLProps<HTMLDivElement> {}

async function fetchDashboardData(): Promise<DashboardApiResponseSuccess> {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export function Ticket({ className, ...props }: TicketProps) {
  const { data: session, status } = useSession();
  const { data, isLoading } = useQuery<DashboardApiResponseSuccess>({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: fetchDashboardData,
    enabled: !!session?.user?.id,
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;
  return (
    <div
      className={cn(
        `flex aspect-[16/9] justify-between rounded-lg border-2 border-gray-300 p-4 sm:p-6 md:p-8 lg:p-10`,
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex flex-col justify-between sm:mb-6 md:mb-8 lg:mb-10">
        <LogoTitle className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl" />
        <div className="flex flex-col gap-1 sm:gap-2">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {data.user.name}
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {data.user.rollNo}
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{`BUS-${data.bus?.busNumber}-${data.seat?.seatId}`}</p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {data.boardingPoint?.name}
          </p>
        </div>
      </div>
      <div className="w-1/2 sm:w-auto">
        <BusPropsProvider disabled={false}>
          <SeatsDataProvider
            data={{
              [`${data.seat?.seatId}`]: "bookedMale",
            }}
          >
            <BusWrapper busId="test" busSeats={data.model!.data} />
          </SeatsDataProvider>
        </BusPropsProvider>
        <p className="w-full text-center text-sm sm:text-base md:text-lg lg:text-xl">
          BUS-{data.bus?.busNumber}
        </p>
      </div>
    </div>
  );
}
