import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/boardingPoint">
          <Button variant="default">Manage Boarding Points</Button>
        </Link>
        <Link href="/admin/model">
          <Button variant="default">Manage Models</Button>
        </Link>
        <Link href="/admin/bus">
          <Button variant="default">Manage Buses</Button>
        </Link>
      </div>
    </div>
  );
}
