import { LogoTitle } from "@/components/LogoTitle";
import { SignInForm } from "@/components/SignInForm";

export default function SignInPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <LogoTitle animate={true} />
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
