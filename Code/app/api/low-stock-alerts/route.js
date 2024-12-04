import { NextResponse } from 'next/server';
import { createConnection } from '../../../lib/db';

export async function GET(request) {
    const db = await createConnection();

    const { searchParams } = new URL(request.url);
    const itemName = searchParams.get('item_name');
    const supplierName = searchParams.get('supplier_name');

    try {
        let sql = `
            SELECT LowStockAlert.item_id, LowStockAlert.item_name, LowStockAlert.current_stock, 
                   LowStockAlert.reorder_level, Supplier.supplier_name
            FROM LowStockAlert
            JOIN InventoryItem ON LowStockAlert.item_id = InventoryItem.id
            JOIN Supplier ON InventoryItem.supplier_id = Supplier.id
        `;
        const values = [];
        const conditions = [];

        // Add conditions for filters
        if (itemName) {
            conditions.push("LowStockAlert.item_name LIKE ?");
            values.push(`%${itemName}%`);
        }
        if (supplierName) {
            conditions.push("Supplier.supplier_name LIKE ?");
            values.push(`%${supplierName}%`);
        }

        if (conditions.length) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        const [alerts] = await db.query(sql, values);
        return NextResponse.json(alerts);
    } catch (error) {
        console.error("Failed to fetch low stock alerts:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
