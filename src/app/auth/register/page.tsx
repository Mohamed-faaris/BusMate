"use client";

import { useQuery } from "@tanstack/react-query";
import { RegisterForm } from "@/components/RegisterForm";
import { LogoTitle } from "@/components/LogoTitle";
import type { BoardingPoint } from "@/app/api/busRoutes/route";
import { Loader } from "@/components/Loader";

/**
 * Render the login page and populate the registration form with boarding points fetched from the server.
 *
 * Displays a centered loading state while boarding points are being fetched, an error message if fetching fails, and the main layout with LogoTitle and RegisterForm when boarding points are available.
 *
 * @returns A React element representing the login page with loading, error, and success states; on success the RegisterForm receives the fetched boarding points.
 */
export default function LoginPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["boardingPoints"],
    queryFn: async () => {
      const res = await fetch(`/api/busRoutes`);
      const data = (await res.json()) as { boardingPoints: BoardingPoint[] };
      const { boardingPoints } = data;
      return boardingPoints;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex items-center gap-2 self-center font-medium">
            <LogoTitle animate={true} />
          </div>
          <div className="flex justify-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex items-center gap-2 self-center font-medium">
            <LogoTitle animate={true} />
          </div>
          <p className="text-red-500">
            Failed to load boarding points. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <LogoTitle animate={true} />
        </div>
        <RegisterForm boardingPoints={data ?? []} />
      </div>
    </div>
  );
}
