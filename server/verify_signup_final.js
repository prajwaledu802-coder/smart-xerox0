const axios = require('axios');
const fs = require('fs');

async function testSignup() {
    console.log("Testing Signup...");
    try {
        const unique = Date.now();
        const response = await axios.post('http://localhost:5000/auth/signup', {
            name: `Test User ${unique}`,
            email: `test${unique}@example.com`,
            mobile: `999${unique.toString().slice(-7)}`,
            password: 'password123'
        });

        if (response.status === 201 && response.data.success) {
            console.log("✅ Signup SUCCESS!");
            console.log("User ID:", response.data.user.id);
            console.log("Token:", response.data.token ? "Received" : "Missing");
        } else {
            console.error("❌ Signup FAILED (Unexpected Status):", response.status, response.data);
        }
    } catch (err) {
        console.error("❌ Signup ERROR:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

testSignup();
