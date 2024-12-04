import { NextResponse } from 'next/server';
import { createConnection } from '../../../../lib/db';

export async function PUT(request, { params }) {
    const db = await createConnection();
    const { id } = await params; // Get item ID from the URL
    const body = await request.json();
    const { quantity_in_stock, reorder_level } = body;
    try {
        const sql = `
            UPDATE InventoryItem
            SET quantity_in_stock = ?, reorder_level = ?
            WHERE id = ?
        `;
        const values = [quantity_in_stock, reorder_level, id];
        await db.query(sql, values);
        return NextResponse.json({ message: 'Inventory item updated successfully' });
    } catch (error) {
        console.error("Error updating inventory:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
