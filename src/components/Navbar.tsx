"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogoTitle } from "./LogoTitle";
import { ThemeToggle } from "./ThemeToggle";
import { Circle, LogOut } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xs">
      <nav className="flex w-full items-center justify-between gap-4 p-4">
        <LogoTitle className="flex-grow text-5xl" />
        <Link href={"/dashboard/account"}>
          <Circle />
        </Link>
        <LogOut onClick={() => signOut()} />
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Navbar;
