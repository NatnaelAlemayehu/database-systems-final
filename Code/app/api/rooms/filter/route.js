import { NextResponse } from 'next/server';
import {createConnection} from '../../../../lib/db'

export async function GET(request) {
    const db = await createConnection();

    const { searchParams } = new URL(request.url);
    const roomNumber = searchParams.get('room_number');
    const status = searchParams.get('status');
    const floorNumber = searchParams.get('floor_number');

    try {
        let sql = `
            SELECT Room.number, Room.floor_number, Room.status, Room.room_type_name,
                   GROUP_CONCAT(Amenity.name ORDER BY Amenity.name SEPARATOR ', ') AS amenities
            FROM Room
            LEFT JOIN RoomAmenity ON Room.number = RoomAmenity.room_number
            LEFT JOIN Amenity ON RoomAmenity.amenity_id = Amenity.id
        `;
        const values = [];
        const conditions = [];

        // Add conditions for filters
        if (roomNumber) {
            conditions.push("Room.number = ?");
            values.push(roomNumber);
        }
        if (status) {
            conditions.push("Room.status = ?");
            values.push(status);
        }
        if (floorNumber) {
            conditions.push("Room.floor_number = ?");
            values.push(floorNumber);
        }

        if (conditions.length) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " GROUP BY Room.number";

        const [rooms] = await db.query(sql, values);
        return NextResponse.json(rooms);
    } catch (error) {
        console.error("Failed to fetch rooms:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
