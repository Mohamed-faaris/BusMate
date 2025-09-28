"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { BusPropsProvider } from "@/contexts/BusPropsContext";
import AdminBusWrapper from "@/components/bus/AdminBusWrapper";
import { Loader } from "@/components/Loader";

type SeatBookingInfo = {
  seatId: string;
  status: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  userRollNo: string | null;
  userGender: string | null;
  createdAt: Date | null;
};

type AdminBusDetailResponse = {
  success: boolean;
  data: {
    bus: {
      bus: {
        id: string;
        busNumber: string;
        routeName: string;
        driverName: string;
        driverPhone: string;
        seats: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      };
      model: {
        id: string;
        model: string;
        data: Record<string, unknown>;
        createdAt: string;
        updatedAt: string;
      };
    };
    passengers: Array<{
      seatId: string | null;
      userId: string;
      userName: string;
      userEmail: string;
      userPhone: string;
      userRollNo: string;
      userGender: string;
      createdAt: Date;
    }>;
    seatBookings: SeatBookingInfo[];
  };
};

export default function AdminBusDetailPage() {
  const params = useParams();
  const router = useRouter();
  const busId = params?.busId as string;

  const {
    data: busDetails,
    isLoading,
    error,
  } = useQuery<AdminBusDetailResponse>({
    queryKey: ["adminBusDetails", busId],
    queryFn: () => fetch(`/api/admin/bus/${busId}`).then((res) => res.json()),
    enabled: !!busId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !busDetails?.success) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card className="p-6">
          <p className="text-destructive">
            Error loading bus details. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  const { bus, passengers, seatBookings } = busDetails.data;
  const busInfo = bus.bus;
  const modelInfo = bus.model;

  // Debug: Let's see what data we have
  console.log("Bus seats data:", busInfo.seats);
  console.log("Passengers from users table:", passengers);
  console.log("Seat bookings from seats table:", seatBookings);

  // Calculate seat statistics from the bus seats data
  const totalSeats = Object.keys(busInfo.seats).length;
  const bookedSeats = Object.values(busInfo.seats).filter(
    (seatStatus) =>
      seatStatus === "bookedMale" || seatStatus === "bookedFemale",
  ).length;
  const reservedSeats = Object.values(busInfo.seats).filter(
    (seatStatus) => seatStatus === "reserved",
  ).length;
  const availableSeats = totalSeats - bookedSeats - reservedSeats;
  const occupancyRate =
    totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  // Combine passenger data - try to match passengers with their seat assignments
  const allPassengers = [
    ...seatBookings.filter((booking) => booking.userId),
    ...passengers.map((passenger) => ({
      seatId: passenger.seatId ?? "Unknown",
      status: "unknown",
      userId: passenger.userId,
      userName: passenger.userName,
      userEmail: passenger.userEmail,
      userPhone: passenger.userPhone,
      userRollNo: passenger.userRollNo,
      userGender: passenger.userGender,
      createdAt: passenger.createdAt,
    })),
  ];

  console.log("Combined passenger data:", allPassengers);

  return (
    <div className="no-scrollbar h-screen overflow-y-auto p-4">
      {/* Compact Header */}
      <div className="mb-4 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-xl font-bold">Bus {busInfo.busNumber}</h1>
          <p className="text-muted-foreground text-sm">
            {modelInfo.model} • {busInfo.routeName}
          </p>
        </div>
      </div>

      {/* Compact Statistics Cards */}
      <div className="mb-4 grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="text-center">
            <p className="text-primary text-2xl font-bold">{occupancyRate}%</p>
            <p className="text-muted-foreground text-xs">Occupancy</p>
            <p className="text-muted-foreground text-xs">
              {bookedSeats}/{totalSeats}
            </p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {availableSeats}
            </p>
            <p className="text-muted-foreground text-xs">Available</p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {reservedSeats}
            </p>
            <p className="text-muted-foreground text-xs">Reserved</p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="text-center">
            <p className="truncate text-sm font-semibold">
              {busInfo.driverName}
            </p>
            <p className="text-muted-foreground text-xs">Driver</p>
          </div>
        </Card>
      </div>

      {/* Compact Layout: Legend and Bus Side by Side */}
      <div className="mb-4 grid grid-cols-5 gap-4">
        {/* Compact Legend */}
        <Card className="col-span-1 p-4">
          <h3 className="mb-3 text-lg font-semibold">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-available border-accent h-4 w-4 rounded border"></div>
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-maleBooked border-accent h-4 w-4 rounded border"></div>
              <span className="text-xs">Male</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-femaleBooked border-accent h-4 w-4 rounded border"></div>
              <span className="text-xs">Female</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-reserved border-accent h-4 w-4 rounded border"></div>
              <span className="text-xs">Reserved</span>
            </div>
          </div>
          <div className="bg-muted/50 text-muted-foreground mt-3 rounded p-2 text-xs">
            Hover seats for details
          </div>
        </Card>

        {/* Bus Diagram */}
        <Card className="col-span-4 p-4">
          <h3 className="mb-3 text-lg font-semibold">Seat Layout</h3>
          <div className="flex justify-center">
            <BusPropsProvider scale={0.8}>
              <AdminBusWrapper
                busId={busId}
                busSeats={modelInfo.data}
                seatBookings={allPassengers}
                busSeatStatuses={busInfo.seats}
              />
            </BusPropsProvider>
          </div>
        </Card>
      </div>

      {/* Compact Passenger Table */}
      {allPassengers.filter((p) => p.userId).length > 0 && (
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Passengers ({allPassengers.filter((p) => p.userId).length})
            </h3>
          </div>
          <div className="max-h-60 overflow-x-auto overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-background sticky top-0">
                <tr className="border-b">
                  <th className="px-2 py-2 text-left">Seat</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Roll No</th>
                  <th className="px-2 py-2 text-left">Gender</th>
                  <th className="px-2 py-2 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {allPassengers
                  .filter((passenger) => passenger.userId)
                  .sort((a, b) =>
                    (a.seatId || "").localeCompare(b.seatId || ""),
                  )
                  .map((passenger, index) => (
                    <tr
                      key={`${passenger.userId}-${index}`}
                      className={`border-border/30 hover:bg-muted/20 border-b ${index % 2 === 0 ? "bg-muted/5" : ""}`}
                    >
                      <td className="px-2 py-2">
                        <div
                          className={`inline-flex h-6 w-8 items-center justify-center rounded text-xs font-semibold text-white ${passenger.userGender === "male" ? "bg-blue-500" : "bg-pink-500"}`}
                        >
                          {passenger.seatId || "?"}
                        </div>
                      </td>
                      <td className="px-2 py-2 font-medium">
                        {passenger.userName}
                      </td>
                      <td className="px-2 py-2">{passenger.userRollNo}</td>
                      <td className="px-2 py-2">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${passenger.userGender === "male" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}`}
                        >
                          {passenger.userGender}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-xs">
                        <div>{passenger.userPhone}</div>
                        <div className="text-muted-foreground max-w-32 truncate">
                          {passenger.userEmail}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {allPassengers.filter((p) => p.userId).length === 0 && (
        <Card className="p-6">
          <div className="text-center">
            <Users className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
            <h3 className="mb-1 text-lg font-semibold">No Passengers Yet</h3>
            <p className="text-muted-foreground text-sm">
              This bus hasn&apos;t been booked by any passengers yet.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
