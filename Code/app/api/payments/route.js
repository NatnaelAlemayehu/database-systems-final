import { NextResponse } from "next/server";
import { createConnection } from "../../../lib/db";

export async function POST(request) {
    const db = await createConnection();
    const body = await request.json();
    const { guest_id, payment_method_name, amount, transaction_reference } = body;

    if (!guest_id || !payment_method_name || !amount || !transaction_reference) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    try {
        const sql = `
            INSERT INTO Payment (guest_id, payment_method_name, amount, transaction_reference, date)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const values = [guest_id, payment_method_name, amount, transaction_reference];

        const [result] = await db.query(sql, values);

        return NextResponse.json({ message: "Payment recorded successfully", id: result.insertId });
    } catch (error) {
        console.error("Error processing payment:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
