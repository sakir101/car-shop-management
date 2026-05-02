import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get("make");

  if (!make) {
    return NextResponse.json(
      { error: "Missing make query parameter" },
      { status: 400 }
    );
  }

  try {

    const url = `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${encodeURIComponent(make)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const raw = await res.text();
    const json = JSON.parse(
      raw.replace(/^var carModels = /, "").replace(/;$/, "")
    );

    return NextResponse.json(json);
  } catch (error) {
    console.error("CarQuery fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch car models" },
      { status: 500 }
    );
  }
}
