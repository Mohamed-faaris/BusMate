import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "@/components/RegisterForm";
import { LogoTitle } from "@/components/LogoTitle";
import { clientEnv } from "@/env";
import type { BoardingPoint } from "@/app/api/busRoutes/route";

export default async function LoginPage() {
  try{
    const res = await fetch(`${clientEnv.NEXT_PUBLIC_BASE_URL}/api/busRoutes`);
    const { boardingPoints }: { boardingPoints: BoardingPoint[] } =
      await res.json();
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex items-center gap-2 self-center font-medium">
            <LogoTitle />
          </div>
          <RegisterForm boardingPoints={boardingPoints} />
        </div>
      </div>
    );
  }
  catch (error) {
    console.error("Error fetching boarding points:", error);
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex items-center gap-2 self-center font-medium">
            <LogoTitle />
          </div>
          <p className="text-red-500">Failed to load boarding points. Please try again later.</p>
          <p>{}</p>
        </div>
      </div>
    );
  }
}
