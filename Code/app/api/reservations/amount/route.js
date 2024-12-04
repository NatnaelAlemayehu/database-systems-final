export async function GET(request) {
    const db = await createConnection();
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get("reservation_id");

    if (!reservationId) {
        return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    try {
        const sql = `
            SELECT 
                CASE
                    WHEN (occupied_rooms.total_occupied / total_rooms.total_available) > (
                        SELECT threshold FROM DynamicPricingRates WHERE increase_rate = MAX(increase_rate)
                    ) THEN RoomType.base_price * (
                        SELECT increase_rate FROM DynamicPricingRates WHERE threshold = (
                            SELECT MAX(threshold) FROM DynamicPricingRates
                            WHERE (occupied_rooms.total_occupied / total_rooms.total_available) > threshold
                        )
                    ) * DATEDIFF(Reservation.check_out_date, Reservation.check_in_date)
                    ELSE RoomType.base_price * DATEDIFF(Reservation.check_out_date, Reservation.check_in_date)
                END AS total_amount_due
            FROM 
                Reservation
            JOIN 
                Room ON Reservation.room_number = Room.number
            JOIN 
                RoomType ON Room.room_type_name = RoomType.name
            LEFT JOIN (
                SELECT 
                    Room.room_type_name, 
                    COUNT(*) AS total_occupied
                FROM 
                    Room
                WHERE 
                    status = 'Occupied'
                GROUP BY 
                    Room.room_type_name
            ) AS occupied_rooms ON Room.room_type_name = occupied_rooms.room_type_name
            LEFT JOIN (
                SELECT 
                    Room.room_type_name, 
                    COUNT(*) AS total_available
                FROM 
                    Room
                GROUP BY 
                    Room.room_type_name
            ) AS total_rooms ON Room.room_type_name = total_rooms.room_type_name
            WHERE 
                Reservation.reservation_id = ?;
        `;

        const [result] = await db.query(sql, [reservationId]);
        return NextResponse.json(result[0]); // Return the calculated amount
    } catch (error) {
        console.error("Error fetching total amount due:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
