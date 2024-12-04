import { NextResponse } from 'next/server';
import { createConnection } from '../../../lib/db';

export async function GET(request) {
    const db = await createConnection();

    const { searchParams } = new URL(request.url);
    const supplierName = searchParams.get('supplier_name');
    const itemName = searchParams.get('item_name');

    try {
        let sql = `
            SELECT InventoryItem.id, InventoryItem.item_name, InventoryItem.description, InventoryItem.quantity_in_stock,
                   InventoryItem.reorder_level, Supplier.supplier_name
            FROM InventoryItem
            JOIN Supplier ON InventoryItem.supplier_id = Supplier.id
        `;
        const values = [];
        const conditions = [];

        // Add conditions for filters
        if (supplierName) {
            conditions.push("Supplier.supplier_name LIKE ?");
            values.push(`%${supplierName}%`);
        }
        if (itemName) {
            conditions.push("InventoryItem.item_name LIKE ?");
            values.push(`%${itemName}%`);
        }

        if (conditions.length) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        const [inventory] = await db.query(sql, values);
        return NextResponse.json(inventory);
    } catch (error) {
        console.error("Failed to fetch inventory:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
