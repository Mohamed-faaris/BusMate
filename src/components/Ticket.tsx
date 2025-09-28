"use client";
import { BusPropsProvider } from "@/contexts/BusPropsContext";
import { SeatsDataProvider } from "@/contexts/seatsDataContext";
import { cn } from "@/lib/utils";
import BusWrapper from "./bus/BusWrapper";
import { LogoTitle } from "./LogoTitle";
import { useQuery } from "@tanstack/react-query";
import type { DashboardApiResponseSuccess } from "@/app/api/dashboard/route";
import { useSession } from "next-auth/react";
import { useWindowSize } from "@/hooks/use-window-size";
import { Button } from "./ui/button";
import Link from "next/link";

export function Ticket({
  className,
  ...props
}: React.HTMLProps<HTMLDivElement>) {
  const { data: session } = useSession();
  const { width } = useWindowSize();
  const { data, isLoading } = useQuery<DashboardApiResponseSuccess>({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: fetchDashboardData,
    enabled: !!session?.user?.id,
  });
  const scale = width && 1440 > width ? 1.1 : 1;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;
  if (data.seat == null) {
    return (
      <div
        className={cn(
          `flex justify-between rounded-lg border-2 border-gray-300 p-8 py-10 pb-4`,
          className,
        )}
        {...props}
      >
        <div className="gap- flex flex-col text-2xl sm:gap-2 lg:text-4xl">
          <p className="capitalize">{data.user.name}</p>
          <p className="uppercase">{data.user.rollNo}</p>
          <p className="capitalize">{data.boardingPoint?.name}</p>
          <Link href="dashboard/booking">
            <Button>Book Now</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        `flex w-7xl justify-between rounded-lg border-2 border-gray-300 p-8 pb-4`,
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex flex-col justify-between sm:mb-6 md:mb-8 lg:mb-10">
        <LogoTitle className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl" />
        <div className="flex flex-col gap-1 text-2xl sm:gap-2 lg:text-4xl">
          <p className="capitalize">{data.user.name}</p>
          <p className="uppercase">{data.user.rollNo}</p>
          <p className="uppercase">{`BUS-${data.bus?.busNumber}-${data.seat?.seatId}`}</p>
          <p className="capitalize">{data.boardingPoint?.name}</p>
        </div>
      </div>
      <div className="">
        <BusPropsProvider disabled={true} scale={scale}>
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
