import { NextResponse } from "next/server";
import { createConnection } from '../../../lib/db';

export async function GET(request) {
    const db = await createConnection();
    const { searchParams } = new URL(request.url);
    const roomType = searchParams.get("roomType");
    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");

    if (!checkInDate || !checkOutDate) {
        return NextResponse.json(
            { error: "Check-in and check-out dates are required" },
            { status: 400 }
        );
    }

    try {
        const sql = `
            SELECT 
                Room.number, 
                Room.floor_number, 
                Room.status, 
                Room.room_type_name
            FROM 
                Room
            WHERE 
                Room.room_type_name = ? 
                AND Room.number NOT IN (
                    SELECT Reservation.room_number
                    FROM Reservation
                    WHERE 
                        Reservation.check_out_date > ? AND 
                        Reservation.check_in_date < ?
                )
        `;

        const values = [roomType, checkInDate, checkOutDate];
        const [availableRooms] = await db.query(sql, values);

        return NextResponse.json(availableRooms);
    } catch (error) {
        console.error("Failed to fetch available rooms:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
