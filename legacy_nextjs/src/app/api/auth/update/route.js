import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function PUT(request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('session_user_id')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, newPassword } = body;

        const data = db.read();
        const userIndex = data.users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = data.users[userIndex];

        // Update fields
        if (name) user.name = name;

        if (newPassword) {
            // In a real app we should validate current password here or require it in body
            // For "easy and fast", we'll just allow update if logged in
            const crypto = require('crypto');
            const salt = crypto.randomBytes(16).toString('hex');
            const hashedPassword = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512').toString('hex');
            user.password = hashedPassword;
            user.salt = salt;
        }

        user.updatedAt = new Date().toISOString();

        // Save
        data.users[userIndex] = user;
        db.write(data);

        const { password: _, salt: __, ...userSafe } = user;
        return NextResponse.json({ user: userSafe }, { status: 200 });

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
