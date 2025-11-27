import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { Wish, WishFormData, WishSubmitResponse, WishesResponse } from '@/types/wishes';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET - Fetch all wishes
export async function GET() {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name, message, created_at FROM wishes ORDER BY created_at DESC LIMIT 100'
        );

        const wishes: Wish[] = rows.map(row => ({
            id: row.id,
            name: row.name,
            message: row.message,
            created_at: row.created_at,
        }));

        const response: WishesResponse = {
            success: true,
            wishes,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching wishes:', error);

        const response: WishesResponse = {
            success: false,
            wishes: [],
            error: 'Failed to fetch wishes',
        };

        return NextResponse.json(response, { status: 500 });
    }
}

// POST - Submit a new wish
export async function POST(request: Request) {
    try {
        const body: WishFormData = await request.json();
        const { name, message } = body;

        // Validation
        if (!name || !message) {
            const response: WishSubmitResponse = {
                success: false,
                message: 'กรุณากรอกชื่อและข้อความ',
                error: 'Name and message are required',
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Validate length
        if (name.length > 100) {
            const response: WishSubmitResponse = {
                success: false,
                message: 'ชื่อยาวเกินไป (สูงสุด 100 ตัวอักษร)',
                error: 'Name too long',
            };
            return NextResponse.json(response, { status: 400 });
        }

        if (message.length > 500) {
            const response: WishSubmitResponse = {
                success: false,
                message: 'ข้อความยาวเกินไป (สูงสุด 500 ตัวอักษร)',
                error: 'Message too long',
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Sanitize input (basic)
        const sanitizedName = name.trim();
        const sanitizedMessage = message.trim();

        // Insert into database
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO wishes (name, message) VALUES (?, ?)',
            [sanitizedName, sanitizedMessage]
        );

        // Fetch the newly created wish
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name, message, created_at FROM wishes WHERE id = ?',
            [result.insertId]
        );

        const newWish: Wish = {
            id: rows[0].id,
            name: rows[0].name,
            message: rows[0].message,
            created_at: rows[0].created_at,
        };

        const response: WishSubmitResponse = {
            success: true,
            message: 'ส่งความสุขสำเร็จ! ขอบคุณที่แบ่งปันความรู้สึกดีๆ',
            wish: newWish,
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error('Error submitting wish:', error);

        const response: WishSubmitResponse = {
            success: false,
            message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
            error: error instanceof Error ? error.message : 'Unknown error',
        };

        return NextResponse.json(response, { status: 500 });
    }
}
