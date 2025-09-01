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
import { useWindowSize } from "@/hooks/use-window-size";
import { Button } from "./ui/button";
import Link from "next/link";

interface TicketProps extends React.HTMLProps<HTMLDivElement> {}

async function fetchDashboardData(): Promise<DashboardApiResponseSuccess> {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export function MobileTicket({ className, ...props }: TicketProps) {
  const { data: session, status } = useSession();
  const { width } = useWindowSize();
  const { data, isLoading } = useQuery<DashboardApiResponseSuccess>({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: fetchDashboardData,
    enabled: !!session?.user?.id,
  });
  let scale = 0.9;
  if (width) {
    if (width< 320) {
      scale = 0.7;
    }
  }
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;
  if (data.seat == null) {
    return (
      <div
        className={cn("h-full flex flex-col justify-between",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col l">
          <p className="capitalize">{data.user.name}</p>
          <p className="uppercase">{data.user.rollNo}</p>
          <p className="capitalize">{data.boardingPoint?.name}</p>
        </div>
        <div className="flex-grow"></div>
        <Link href="dashboard/booking" >
            <Button className="w-full">Book Now</Button>
        </Link>
      </div>
    );
  }
  return (
    <div
      className={cn(
        `flex flex-col justify-between  p-4 pb-4 items-center`,
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex flex-col justify-between sm:mb-6 md:mb-8 lg:mb-10">
        <div className="flex flex-col gap-1 text-2xl sm:gap-2 lg:text-4xl">
          <p className="capitalize">{data.user.name}</p>
          <p className="uppercase">{data.user.rollNo}</p>
          <p className="uppercase">{`BUS-${data.bus?.busNumber}-${data.seat?.seatId}`}</p>
          <p className="capitalize">{data.boardingPoint?.name}</p>
        </div>
      </div>
      <div className="flex">

      <div className="flex flex-col justify-center items-center">
        <BusPropsProvider disabled={false} scale={scale}>
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
    </div>
  );
}
