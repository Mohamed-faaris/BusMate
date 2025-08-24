//fill it with model user details page
"use client";
import React from "react";
import { Card } from "@/components/ui/card";

export default function UserDetailsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">User Details</h1>
      <Card className="p-4">
        <p>Details about the user will be displayed here.</p>
      </Card>
    </div>
  );
}
