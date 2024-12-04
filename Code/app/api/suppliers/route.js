import { NextResponse } from 'next/server';
import { createConnection } from '../../../lib/db'; // Adjust the path as needed for your db connection

export async function GET(request) {
    const db = await createConnection();

    const { searchParams } = new URL(request.url);
    const supplierName = searchParams.get('supplier_name');
    const contactPerson = searchParams.get('contact_person');
    const employeeName = searchParams.get('employee_name');

    try {
        let sql = `
            SELECT Supplier.supplier_name, Supplier.contact_person_full_name, Supplier.phone_number, 
                   Supplier.email, CONCAT(Employee.first_name, ' ', Employee.last_name) AS managing_employee
            FROM Supplier
            JOIN Employee ON Supplier.employee_id = Employee.ssn
        `;
        const values = [];
        const conditions = [];

        // Add conditions for filters
        if (supplierName) {
            conditions.push("Supplier.supplier_name LIKE ?");
            values.push(`%${supplierName}%`);
        }
        if (contactPerson) {
            conditions.push("Supplier.contact_person_full_name LIKE ?");
            values.push(`%${contactPerson}%`);
        }
        if (employeeName) {
            conditions.push("CONCAT(Employee.first_name, ' ', Employee.last_name) LIKE ?");
            values.push(`%${employeeName}%`);
        }

        if (conditions.length) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        const [suppliers] = await db.query(sql, values);
        return NextResponse.json(suppliers);
    } catch (error) {
        console.error("Failed to fetch suppliers:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
