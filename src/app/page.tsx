import { LogoTitle } from "@/components/LogoTitle";
import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import Link from "next/link";


export default async function HomePage() {
  //const session = await auth();
  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <LogoTitle animate={true} />
        <Link href={"/auth/register"} className="mt-4">
          <Button>register</Button>
        </Link>
        <Link href={"/auth/signIn"}>
          <Button>sign in</Button>
        </Link>
        <p>
          {/* {JSON.stringify(session)} */}
        </p>
      </div>
    </main>
  );
}
