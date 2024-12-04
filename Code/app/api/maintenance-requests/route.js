import { NextResponse } from 'next/server';
import { createConnection } from '../../../lib/db';

export async function GET(request) {
    const db = await createConnection();

    const { searchParams } = new URL(request.url);
    const roomNumber = searchParams.get('room_number');
    const status = searchParams.get('status');
    const roomTypeName = searchParams.get('room_type_name');
    const floorNumber = searchParams.get('floor_number');

    try {
        let sql = `
            SELECT MaintenanceRequest.room_number AS number, 
                   MaintenanceRequest.issue_description, 
                   MaintenanceRequest.request_date, 
                   MaintenanceRequest.status, 
                   Room.room_type_name, 
                   Room.floor_number,
                   GROUP_CONCAT(CONCAT(Employee.first_name, ' ', Employee.last_name) SEPARATOR ', ') AS assigned_employees
            FROM MaintenanceRequest
            JOIN Room ON MaintenanceRequest.room_number = Room.number
            LEFT JOIN MaintenanceRequestEmployee ON MaintenanceRequest.id = MaintenanceRequestEmployee.maintenance_request_id
            LEFT JOIN Employee ON MaintenanceRequestEmployee.employee_ssn = Employee.ssn
        `;
        const values = [];
        const conditions = [];

        // Add conditions for filters
        if (roomNumber) {
            conditions.push("MaintenanceRequest.room_number = ?");
            values.push(roomNumber);
        }
        if (status) {
            conditions.push("MaintenanceRequest.status = ?");
            values.push(status);
        }
        if (roomTypeName) {
            conditions.push("Room.room_type_name = ?");
            values.push(roomTypeName);
        }
        if (floorNumber) {
            conditions.push("Room.floor_number = ?");
            values.push(floorNumber);
        }

        if (conditions.length) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += " GROUP BY MaintenanceRequest.id";

        const [requests] = await db.query(sql, values);
        return NextResponse.json(requests);
    } catch (error) {
        console.error("Failed to fetch maintenance requests:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request) {
    const db = await createConnection();
    const body = await request.json();

    const { room_number, issue_description, employee_ssn } = body;

    if (!room_number || !issue_description || !employee_ssn) {
        return NextResponse.json(
            { error: "Room number, issue description, and employee are required" },
            { status: 400 }
        );
    }

    try {
        // Insert into MaintenanceRequest
        const sql = `
            INSERT INTO MaintenanceRequest (room_number, issue_description, request_date, status)
            VALUES (?, ?, NOW(), 'Pending');
        `;
        const values = [room_number, issue_description];

        const [result] = await db.query(sql, values);

        // Insert into MaintenanceRequestEmployee
        const maintenanceRequestId = result.insertId;
        const employeeSql = `
            INSERT INTO MaintenanceRequestEmployee (maintenance_request_id, employee_ssn)
            VALUES (?, ?);
        `;
        await db.query(employeeSql, [maintenanceRequestId, employee_ssn]);

        // Fetch and return the newly created request
        const [newRequest] = await db.query(
            `
            SELECT MaintenanceRequest.room_number AS number, 
                   MaintenanceRequest.issue_description, 
                   MaintenanceRequest.request_date, 
                   MaintenanceRequest.status, 
                   Room.room_type_name, 
                   Room.floor_number,
                   GROUP_CONCAT(CONCAT(Employee.first_name, ' ', Employee.last_name) SEPARATOR ', ') AS assigned_employees
            FROM MaintenanceRequest
            JOIN Room ON MaintenanceRequest.room_number = Room.number
            LEFT JOIN MaintenanceRequestEmployee ON MaintenanceRequest.id = MaintenanceRequestEmployee.maintenance_request_id
            LEFT JOIN Employee ON MaintenanceRequestEmployee.employee_ssn = Employee.ssn
            WHERE MaintenanceRequest.id = ?
            GROUP BY MaintenanceRequest.id;
            `,
            [maintenanceRequestId]
        );

        return NextResponse.json(newRequest[0]);
    } catch (error) {
        console.error("Failed to create maintenance request:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
