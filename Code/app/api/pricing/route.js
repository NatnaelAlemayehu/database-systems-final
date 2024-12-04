import { NextResponse } from "next/server";
import { createConnection } from '../../../lib/db';

export async function GET(request) {
    const db = await createConnection();
    const { searchParams } = new URL(request.url);
    const roomTypeName = searchParams.get("room_type_name");
    const checkInDate = searchParams.get("check_in_date");
    const checkOutDate = searchParams.get("check_out_date");

    if (!roomTypeName || !checkInDate || !checkOutDate) {
        return NextResponse.json(
            { error: "Room type, check-in date, and check-out date are required" },
            { status: 400 }
        );
    }

    try {
        const sql = `
        SELECT 
            CASE
                WHEN (COALESCE(reserved_rooms.total_reserved, 0) / total_rooms.total_available) > 0.9 THEN RoomType.base_price * 1.4 * DATEDIFF(?, ?)
                WHEN (COALESCE(reserved_rooms.total_reserved, 0) / total_rooms.total_available) > 0.7 THEN RoomType.base_price * 1.2 * DATEDIFF(?, ?)
                ELSE RoomType.base_price * DATEDIFF(?, ?)
            END AS total_price
        FROM 
            RoomType
        LEFT JOIN (
            SELECT 
                Room.room_type_name, 
                COUNT(DISTINCT Reservation.room_number) AS total_reserved
            FROM 
                Reservation
            INNER JOIN Room ON Reservation.room_number = Room.number
            WHERE 
                (Reservation.check_in_date < ? AND Reservation.check_out_date > ?) -- Check for overlapping dates
            GROUP BY 
                Room.room_type_name
        ) AS reserved_rooms ON RoomType.name = reserved_rooms.room_type_name
        LEFT JOIN (
            SELECT 
                Room.room_type_name, 
                COUNT(*) AS total_available
            FROM 
                Room
            GROUP BY 
                Room.room_type_name
        ) AS total_rooms ON RoomType.name = total_rooms.room_type_name
        WHERE 
            RoomType.name = ?;    
        `;

        const values = [
            checkOutDate, // For `DATEDIFF` in the first CASE condition (occupancy > 90%)
            checkInDate,  // For `DATEDIFF` in the first CASE condition
            checkOutDate, // For `DATEDIFF` in the second CASE condition (occupancy > 70%)
            checkInDate,  // For `DATEDIFF` in the second CASE condition
            checkOutDate, // For `DATEDIFF` in the ELSE condition (base price)
            checkInDate,  // For `DATEDIFF` in the ELSE condition
            checkOutDate, // For overlapping reservation filter (Reservation.check_in_date < checkOutDate)
            checkInDate,  // For overlapping reservation filter (Reservation.check_out_date > checkInDate)
            roomTypeName  // For filtering by room type
        ];
        

        const [result] = await db.query(sql, values);
        
        return NextResponse.json(result[0]); // Return the calculated price
    } catch (error) {
        console.error("Error calculating total price:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
