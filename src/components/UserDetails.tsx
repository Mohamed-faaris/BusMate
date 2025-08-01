"use client";
import { useSession } from "next-auth/react";

export default function UserDetails() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div>
        <h1>User Details</h1>
        <p>Name: {session.user.name}</p>
        <p>Email: {session.user.email}</p>
        <p>JSON: {JSON.stringify(session)}</p>
      </div>
    );
  }

  return <p>You are not logged in.</p>;
}
