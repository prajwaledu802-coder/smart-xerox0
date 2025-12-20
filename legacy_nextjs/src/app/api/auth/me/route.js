import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('session_user_id')?.value;

        if (!userId) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const data = db.read();
        const user = data.users.find(u => u.id === userId);

        if (!user) {
            // Invalid session, maybe user deleted
            cookieStore.delete('session_user_id');
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const { password: _, salt: __, ...userSafe } = user;
        return NextResponse.json({ user: userSafe }, { status: 200 });

    } catch (error) {
        console.error('Session error:', error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
