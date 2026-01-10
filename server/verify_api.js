const axios = require('axios');
const { Sequelize } = require('sequelize');
const path = require('path');
const User = require('./models/User');

async function verifyApi() {
    try {
        // 1. Ensure DB connection and User exists
        console.log('1. Checking Database...');
        // We rely on the server running, but we can also check DB directly
        const testEmail = 'testverify@example.com';
        const testPass = 'password123';

        // Find or create user
        let user = await User.findOne({ where: { email: testEmail } });
        if (!user) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(testPass, salt);
            user = await User.create({
                name: 'Verification User',
                email: testEmail,
                mobile: '9999999999',
                password: hashedPassword
            });
            console.log(' - Created test user');
        } else {
            console.log(' - Found test user');
        }

        // 2. Test Login API
        console.log('2. Testing /auth/login API...');
        const response = await axios.post('http://localhost:5000/auth/login', {
            email: testEmail,
            password: testPass
        });

        if (response.data.success && response.data.token) {
            console.log('SUCCESS: API Login successful!');
            console.log('Token received:', response.data.token.substring(0, 20) + '...');
        } else {
            console.error('FAILURE: Login query returned success=false', response.data);
        }

    } catch (error) {
        console.error('FAILURE: API Verification Failed', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

// We need to initialize sequelize if we use models directly, but models require it.
// server/models/User.js requires ../config/database, which creates a new Sequelize instance.
// This is fine for this script.
verifyApi();
