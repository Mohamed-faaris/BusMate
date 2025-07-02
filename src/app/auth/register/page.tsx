import { GalleryVerticalEnd } from "lucide-react";
import { RegisterForm } from "@/components/RegisterForm";
import { LogoTitle } from "@/components/LogoTitle";



export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <LogoTitle />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
