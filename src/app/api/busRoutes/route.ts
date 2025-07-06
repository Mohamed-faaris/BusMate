import type { NextRequest, NextResponse } from "next/server";

// Boarding point options
const BOARDING_POINTS: { id: string; name: string }[] = [
  { id: "central-bus-stand", name: "Central Bus Stand" },
  { id: "railway-station", name: "Railway Station" },
  { id: "airport", name: "Airport" },
  { id: "city-center", name: "City Center" },
  { id: "university-gate", name: "University Gate" },
  { id: "shopping-mall", name: "Shopping Mall" },
  { id: "bus-depot", name: "Bus Depot" },
  { id: "metro-station", name: "Metro Station" },
  { id: "government-hospital", name: "Government Hospital" },
  { id: "private-hospital", name: "Private Hospital" },
  { id: "college-campus", name: "College Campus" },
  { id: "tech-park", name: "Tech Park" },
  { id: "industrial-area", name: "Industrial Area" },
  { id: "residential-complex", name: "Residential Complex" },
  { id: "temple-area", name: "Temple Area" },
  { id: "market-square", name: "Market Square" },
  { id: "sports-complex", name: "Sports Complex" },
  { id: "library", name: "Central Library" },
  { id: "park-entrance", name: "Park Entrance" },
  { id: "bus-terminal", name: "Interstate Bus Terminal" },
];

export async function GET(req: NextRequest) {
    return Response.json({
        boardingPoints: BOARDING_POINTS,
    }, { status: 200 });
}