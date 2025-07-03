import { LogoTitle } from "@/components/LogoTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <LogoTitle />
        <Link href={"/auth/register"}>
          <Button>register</Button>
        </Link>
      </div>
    </main>
  );
}
