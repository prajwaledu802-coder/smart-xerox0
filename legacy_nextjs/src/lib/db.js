import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure database directory and file exist
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], sessions: [] }, null, 2));
}

export const db = {
    read: () => {
        try {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Database read error:', error);
            return { users: [], sessions: [] };
        }
    },

    write: (data) => {
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Database write error:', error);
            return false;
        }
    },

    // USER METHODS
    createUser: ({ email, password, name }) => {
        const data = db.read();
        if (data.users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        const newUser = {
            id: crypto.randomUUID(),
            email,
            name,
            password: hashedPassword,
            salt,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        data.users.push(newUser);
        db.write(data);

        // Return user without sensitive data
        const { password: _, salt: __, ...userSafe } = newUser;
        return userSafe;
    },

    getUserByEmail: (email) => {
        const data = db.read();
        return data.users.find(u => u.email === email);
    },

    validatePassword: (user, password) => {
        const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
        return user.password === hash;
    }
};
