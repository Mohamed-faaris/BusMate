"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import Bus from "@/components/bus/Bus";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSeat } from "@/contexts/BusPropsContext";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Bus {
  id: string;
  name: string;
}

export default function BookingPage() {
  const [selectedBus, setSelectedBus] = useState("");
  const { data: session } = useSession();
  const { selectedSeat, setSelectedSeat } = useSeat();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const res = await fetch(`/api/user/${session.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!session?.user?.id,
  });

  const {
    mutate: bookSeat,
    isPending: isBooking,
    isError: isBookingError,
    error: bookingError,
  } = useMutation({
    mutationFn: async () => {
      if (!selectedSeat || !userData?.user) return;

      const newStatus =
        userData.user.gender === "male" ? "bookedMale" : "bookedFemale";

      const res = await fetch("/api/bookSeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: selectedSeat.id,
          busId: selectedBus,
        }),
      });

      if (!res.ok) {
        console.log("Failed");
        throw new Error((await res.json())?.error ?? "Failed to book seat");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["busSeats", selectedBus] });
      setSelectedSeat(null);
      router.push("/dashboard");
    },
  });

  const boardingPointId = userData?.user?.boardingPoint?.id;
  const { data: busesData, isLoading: areBusesLoading } = useQuery({
    queryKey: ["buses", boardingPointId],
    queryFn: async () => {
      if (!boardingPointId) return [];
      const res = await fetch(`/api/bus/byBoardingPoint/${boardingPointId}`);
      if (!res.ok) throw new Error("Failed to fetch buses");
      return res.json();
    },
    enabled: !!boardingPointId,
  });

  const buses: Bus[] = busesData || [];

  useEffect(() => {
    if (buses.length > 0 && !selectedBus && buses[0]) {
      setSelectedBus(buses[0].id);
    }
  }, [buses, selectedBus]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col items-center justify-center gap-6">
        {isUserLoading && <Spinner className="h-6 w-6" />}
        {userData?.user && (
          <div>
            <h2 className="text-lg font-semibold">
              Welcome, {userData.user.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              Your boarding point: {userData.user.boardingPoint?.name}
            </p>
          </div>
        )}
        <div className="flex gap-4"></div>

        {selectedBus && <Bus busId={selectedBus} />}
        <Combobox
          options={buses.map((bus) => ({ value: bus.id, label: bus.name }))}
          value={selectedBus}
          onChange={setSelectedBus}
          placeholder={areBusesLoading ? "Loading buses..." : "Select Bus"}
          searchPlaceholder="Search buses..."
          emptyPlaceholder="No buses found for this route."
        />
        {areBusesLoading && (
          <Spinner className="h-6 w-6" variant="circle-filled" />
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={
                !selectedSeat || selectedSeat.seatStatus !== "available"
              }
              className="w-full"
            >
              Book Now
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm your booking</DialogTitle>
              <DialogDescription>
                Please review your booking details before confirming.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right font-semibold">Name</p>
                <p className="col-span-3">{userData?.user?.name}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right font-semibold">Boarding Point</p>
                <p className="col-span-3">
                  {userData?.user?.boardingPoint?.name}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right font-semibold">Seat</p>
                <p className="col-span-3">{selectedSeat?.id.slice(-3)}</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => bookSeat()}
                disabled={isBooking}
              >
                {isBookingError == false
                  ? isBooking
                    ? "Booking..."
                    : "Confirm Booking"
                  : String(bookingError)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
