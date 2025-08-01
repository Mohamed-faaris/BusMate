"use client"
import { useSession } from "next-auth/react";

export default function AccountPage() {
  const { data } = useSession();
  
  return <>{JSON.stringify(data)}</>;
}