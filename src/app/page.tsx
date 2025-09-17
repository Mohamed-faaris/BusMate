"use client";
import { Loader } from "@/components/Loader";
import { LogoTitle } from "@/components/LogoTitle";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

export default function HomePage() {
 const session = useSession();

  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full flex flex-col items-center gap-2">
        <LogoTitle animate={true} />
        {/* User fetch form */}
        <p className="px-1 text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur iusto maiores eos tempora consequatur. Id officia eligendi sint assumenda, tenetur eum, dolorem ex officiis earum perspiciatis maxime cum facere sequi?</p>
  {(() => {
    if (session.status === "authenticated") {
      return (
        <Link href="/dashboard">
          <Button className="w-full">Go to Dashboard</Button>
        </Link>
      );
    } else if (session.status === "unauthenticated") {
      return (
        <Link href="/auth/signIn">
          <Button>Login</Button>
        </Link>
      );
    } else {
      return <Loader />;
    }
  })()}
      </div>
    </main>
  );
}
