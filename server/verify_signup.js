const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testSignup() {
    try {
        const form = new FormData();
        form.append('name', 'Test User');
        form.append('email', `testuser${Date.now()}@example.com`);
        form.append('mobile', `9${Date.now().toString().substring(4)}`);
        form.append('password', 'password123');

        console.log('Sending Signup Request to http://localhost:5000/auth/signup...');
        const response = await axios.post('http://localhost:5000/auth/signup', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Signup Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Signup Failed Status:', error.response.status);
            console.error('Signup Failed Data:', error.response.data);
        } else if (error.request) {
            console.error('Signup Error: No response received', error.message);
        } else {
            console.error('Signup Error:', error.message);
        }
        console.error('Full Error Config:', error.config);
    }
}

testSignup();
