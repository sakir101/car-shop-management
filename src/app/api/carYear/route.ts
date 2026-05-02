import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const model = searchParams.get("model");

  if (!model) {
    return NextResponse.json(
      { error: "Missing model query parameter" },
      { status: 400 }
    );
  }

  try {

    const url = `https://www.carqueryapi.com/api/0.3/?cmd=getYears&model=${model}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const raw = await res.text();
    const json = JSON.parse(
      raw.replace(/^var carYears= /, "").replace(/;$/, "")
    );

    return NextResponse.json(json);
  } catch (error) {
    console.error("CarQuery fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch car years" },
      { status: 500 }
    );
  }
}
