import { NextResponse } from 'next/server';
import { createConnection } from '../../../../lib/db';

export async function GET() {
    const db = await createConnection();

    try {
        const sql = `
            SELECT 
                Room.number AS room_number,
                Room.floor_number,
                Room.room_type_name,
                Room.status
            FROM Room;
        `;

        const [rooms] = await db.query(sql);

        return NextResponse.json(rooms);
    } catch (error) {
        console.error("Failed to fetch rooms:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
