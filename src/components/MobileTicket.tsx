"use client";
import { BusPropsProvider } from "@/contexts/BusPropsContext";
import { SeatsDataProvider } from "@/contexts/seatsDataContext";
import { cn } from "@/lib/utils";
import BusWrapper from "./bus/BusWrapper";
import { useQuery } from "@tanstack/react-query";
import type { DashboardApiResponseSuccess } from "@/app/api/dashboard/route";
import { useSession } from "next-auth/react";
import { useWindowSize } from "@/hooks/use-window-size";
import { Button } from "./ui/button";
import Link from "next/link";

/**
 * Fetches the dashboard API and returns the parsed success response.
 *
 * @returns The parsed `DashboardApiResponseSuccess` from the `/api/dashboard` endpoint.
 * @throws Error when the response has a non-ok HTTP status.
 */
async function fetchDashboardData(): Promise<DashboardApiResponseSuccess> {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json() as Promise<DashboardApiResponseSuccess>;
}

/**
 * Renders a mobile ticket view for the current user based on dashboard data.
 *
 * Displays a loading state while fetching dashboard data and a "No data" message when no data is available.
 * If the user has no assigned seat, shows user and boarding information with a "Book Now" CTA.
 * If the user has a seat, displays a scaled bus visualization with the booked seat highlighted and a compact info block
 * containing the user's name, roll number, bus-seat identifier, and boarding point.
 *
 * @returns The rendered ticket UI as a React element.
 */
export function MobileTicket({
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
  const scale = width && width < 320 ? 0.7 : 0.9;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;
  if (data.seat == null) {
    return (
      <div
        className={cn("flex h-full flex-col justify-between", className)}
        {...props}
      >
        <div className="flex flex-col text-3xl font-light">
          <p className="capitalize">{data.user.name}</p>
          <p className="uppercase">{data.user.rollNo}</p>
          <p className="capitalize">{data.boardingPoint?.name}</p>
        </div>
        <div className="flex-grow"></div>
        <Link href="dashboard/booking">
          <Button className="w-full">Book Now</Button>
        </Link>
      </div>
    );
  }
  return (
    <div
      className={cn(
        `flex flex-col items-center justify-between p-4 pb-4`,
        className,
      )}
      {...props}
    >
      <div className="flex">
        <div className="flex flex-col items-center justify-center">
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
      <div className="mt-4 flex w-[250px] flex-col gap-1 text-2xl sm:gap-2 lg:text-4xl">
        <p className="capitalize">{data.user.name}</p>
        <p className="uppercase">{data.user.rollNo}</p>
        <p className="uppercase">{`BUS-${data.bus?.busNumber}-${data.seat?.seatId}`}</p>
        <p className="capitalize">{data.boardingPoint?.name}</p>
      </div>
    </div>
  );
}
