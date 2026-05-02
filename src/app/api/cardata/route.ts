export const dynamic = "force-dynamic"; 
import { NextResponse } from "next/server";

export async function GET() {
    const response = await fetch("https://www.carqueryapi.com/api/0.3/?cmd=getMakes");
    const text = await response.text();
    // CarQuery wraps the response like: var carquery = {...};
    const json = JSON.parse(text.replace("var carquery = ", "").replace(/;$/, ""));

    return NextResponse.json(json); 
}