import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, name } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        try {
            const newUser = db.createUser({ email, password, name });

            // Create a session (simple cookie for now)
            // In a real app we might want a session table, but for "fast and easy" 
            // we can just store the user ID signed/encrypted or just the ID if we trust localhost environment.
            // Better approach: Store user ID in a cookie.

            const cookieStore = await cookies();
            cookieStore.set('session_user_id', newUser.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ user: newUser }, { status: 201 });
        } catch (e) {
            if (e.message === 'User already exists') {
                return NextResponse.json(
                    { error: 'User already exists' },
                    { status: 409 }
                );
            }
            throw e;
        }

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
