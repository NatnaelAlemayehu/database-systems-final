import { createConnection } from "../../../lib/db";
import { NextResponse } from 'next/server';
export async function GET() {
    const db = await createConnection();
    const [rates] = await db.query("SELECT * FROM DynamicPricingRates");
    return NextResponse.json(rates);
}

export async function POST(request) {
    const db = await createConnection();
    const { threshold, increase_rate } = await request.json();

    if (!threshold || !increase_rate) {
        return NextResponse.json({ error: "Threshold and increase rate are required" }, { status: 400 });
    }

    try {
        await db.query("INSERT INTO DynamicPricingRates (threshold, increase_rate) VALUES (?, ?)", [
            threshold,
            increase_rate,
        ]);
        return NextResponse.json({ message: "Rate added successfully" });
    } catch (error) {
        console.error("Error adding rate:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}