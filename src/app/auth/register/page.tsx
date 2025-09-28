"use client";

import { useQuery } from "@tanstack/react-query";
import { RegisterForm } from "@/components/RegisterForm";
import { LogoTitle } from "@/components/LogoTitle";
import { clientEnv } from "@/env";
import type { BoardingPoint } from "@/app/api/busRoutes/route";
import { Loader } from "@/components/Loader";

export default function LoginPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["boardingPoints"],
    queryFn: async () => {
      const res = await fetch(`${clientEnv.NEXT_PUBLIC_BASE_URL}/api/busRoutes`);
      const { boardingPoints }: { boardingPoints: BoardingPoint[] } = await res.json();
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
          <p><Loader /></p>
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
        <RegisterForm boardingPoints={data || []} />
      </div>
    </div>
  );
}
