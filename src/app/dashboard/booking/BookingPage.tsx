"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useEffect, useState } from "react";
import Bus from "@/components/bus/Bus";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

interface Bus {
  id: string;
  name: string;
}

export default function BookingPage() {
  const [selectedBus, setSelectedBus] = useState("");
  const { data: session } = useSession();

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

  const boardingPointId = userData?.user?.boardingPoint?.id;
  //console.log(userData, boardingPointId);
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
    if (buses.length > 0 && !selectedBus) {
      setSelectedBus(buses[0].id);
    }
  }, [buses, selectedBus]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {isUserLoading && <p>Loading user details...</p>}
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
      <Button>Book Now</Button>
    </div>
  );
}
