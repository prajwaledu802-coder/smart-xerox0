const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config();
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-xerox');
        console.log('MongoDB Connected');

        const User = require('../models/User');

        console.log('Dropping indexes...');
        try {
            await User.collection.dropIndexes();
            console.log('Indexes dropped successfully.');
        } catch (error) {
            console.log('Error dropping indexes (might not exist):', error.message);
        }

        console.log('Recreating indexes by sinking models...');
        await User.syncIndexes();
        console.log('Indexes synced successfully with new schema.');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

connectDB();
