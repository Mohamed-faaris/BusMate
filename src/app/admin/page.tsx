import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/boardingPoint">
          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Manage Boarding Points
          </button>
        </Link>
        <Link href="/admin/bus">
          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Manage Buses
          </button>
        </Link>
      </div>
    </div>
  );
}
