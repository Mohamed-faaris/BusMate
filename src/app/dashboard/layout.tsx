"use client"
import { Loader } from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const router = useRouter();
  if (session.status === "unauthenticated") {
    // Redirect to sign-in page
    router.push("/auth/signIn");
  }else if (session.status === "loading") {
    return <Loader />;
  }
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
