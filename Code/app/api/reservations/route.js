import { NextResponse } from 'next/server';
import {createConnection} from '../../../lib/db'

export async function GET(request) {
    const db = await createConnection();

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get('first_name');
    const lastName = searchParams.get('last_name');
    const roomNumber = searchParams.get('room_number');
    const status = searchParams.get('status');
    const reservationId = searchParams.get('reservation_id'); // Add support for reservation ID

    try {
        let sql = `
            SELECT Reservation.*, Guest.first_name, Guest.last_name 
            FROM Reservation
            JOIN Guest ON Reservation.guest_id = Guest.id
        `;
        const values = [];

        // Build SQL query dynamically based on filters
        const conditions = [];
        if (reservationId) {
            conditions.push("Reservation.reservation_id = ?");
            values.push(reservationId);
        }
        if (firstName) {
            conditions.push("Guest.first_name LIKE ?");
            values.push(`%${firstName}%`);
        }
        if (lastName) {
            conditions.push("Guest.last_name LIKE ?");
            values.push(`%${lastName}%`);
        }
        if (roomNumber) {
            conditions.push("Reservation.room_number = ?");
            values.push(roomNumber);
        }
        if (status) {
            conditions.push("Reservation.reservation_status = ?");
            values.push(status);
        }

        if (conditions.length) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        const [reservations] = await db.query(sql, values);

        // If querying by reservation ID, return a single object instead of an array
        if (reservationId) {
            return NextResponse.json(reservations[0] || {}); // Return an empty object if no match
        }

        return NextResponse.json(reservations);
    } catch (error) {
        console.error("Failed to fetch reservations:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}




export async function POST(request) {
    try {
        const db = await createConnection();
        const body = await request.json();
        
        const { guest_id, check_in_date, check_out_date, room_number, amount_due } = body;
        
        const sql = `
            INSERT INTO Reservation (guest_id, check_in_date, check_out_date, room_number, reservation_status, amount_due, payment_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [guest_id, check_in_date, check_out_date, room_number, 'Confirmed', amount_due, null];
        const [result] = await db.query(sql, values);
        return NextResponse.json({ message: 'Reservation created successfully', reservationId: result.insertId });
    } catch (error) {
        console.error('Failed to create reservation:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

