import {createConnection} from '../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET(){
    try{
        const db = await createConnection()
        const sql = "SELECT * FROM Guest"
        const [users] = await db.query(sql)
        return NextResponse.json(users)
    } catch(error){
        console.log(error)
        return NextResponse.json({error: error.message})
    }
}

export async function POST(request) {
    try {
        const db = await createConnection()
        const body = await request.json() // parse request body
        const { first_name, last_name, email, phone_number, street, city, state, zip_code } = body

        const sql = `
            INSERT INTO Guest (first_name, last_name, email, phone_number, street, city, state, zip_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `
        const values = [first_name, last_name, email, phone_number, street, city, state, zip_code]
        
        const [result] = await db.query(sql, values)

        return NextResponse.json({ message: "User created successfully", id: result.insertId })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request) {
    try {
        const db = await createConnection()
        const body = await request.json()
        
        // Destructure the id and other fields from the request body
        const { id, first_name, last_name, email, phone_number, street, city, state, zip_code } = body

        // Check if the id is provided
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 })
        }

        const sql = `
            UPDATE Guest 
            SET first_name = ?, last_name = ?, email = ?, phone_number = ?, street = ?, city = ?, state = ?, zip_code = ? 
            WHERE id = ?
        `
        const values = [first_name, last_name, email, phone_number, street, city, state, zip_code, id]
        
        await db.query(sql, values)

        return NextResponse.json({ message: "User updated successfully" })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
