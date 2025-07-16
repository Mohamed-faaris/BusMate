"use client";
import { LogoTitle } from "@/components/LogoTitle";
import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import Link from "next/link";
import React, { useState } from "react";

export default function HomePage() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    if (!userId) {
      setError("Please enter a user ID");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch user");
        setUser(null);
      } else {
        setUser(data.user);
      }
    } catch (err) {
      setError("Error fetching user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <LogoTitle animate={true} />
        {/* User fetch form */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1 rounded border p-2"
          />
          <button
            onClick={fetchUser}
            className="rounded bg-blue-500 px-4 py-2 text-white"
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch User"}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {user && (
          <div className="rounded bg-white p-4 shadow">
            <h2 className="text-lg font-bold">User Details</h2>
            <pre className="mt-2 text-sm">{JSON.stringify(user, null, 2)}</pre>
          </div>
        )}
        <div className="flex justify-between">
          <Link href={"/auth/register"}>
            <Button>register</Button>
          </Link>
          <Link href={"/auth/signIn"}>
            <Button>sign in</Button>
          </Link>
          <Link href={"/dashboard/booking"}>
            <Button>Booking</Button>
          </Link>
          <Link href={"/admin"}>
            <Button>Admin</Button>
          </Link>
          <p>{/* {JSON.stringify(session)} */}</p>
        </div>
      </div>
    </main>
  );
}
