import { NextResponse } from 'next/server';
import { createConnection } from '../../../lib/db';

export async function GET() {
    const db = await createConnection();

    try {
        const sql = `
            SELECT ssn, first_name, last_name
            FROM Employee;
        `;
        const [employees] = await db.query(sql);

        return NextResponse.json(employees);
    } catch (error) {
        console.error("Failed to fetch employees:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
