"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LogoTitle } from "./LogoTitle";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 items-center">
        <LogoTitle className="scale-50" />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-5">
            {/* <Link
              href="/dashboard"
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Dashboard
            </Link> */}
            {session?.user.role === "admin" && (
              <Link
                href="/admin"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* <SessionUserDetails /> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
