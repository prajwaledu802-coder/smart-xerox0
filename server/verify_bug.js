const axios = require('axios');
const FormData = require('form-data');

async function testSignupWithBadHeader() {
    try {
        const form = new FormData();
        form.append('name', 'Bad Header User');
        form.append('email', `badheader${Date.now()}@example.com`);
        form.append('mobile', `8${Date.now().toString().substring(4)}`);
        form.append('password', 'password123');

        console.log('Sending Signup Request with FORCED BAD HEADER...');

        // Simulating the bug: setting Content-Type without boundary
        // Note: In Node, form-data requires getHeaders() for the boundry. 
        // If we overwrite it, it mimics the browser issue where boundary is lost.
        const response = await axios.post('http://localhost:5000/auth/signup', form, {
            headers: {
                'Content-Type': 'multipart/form-data' // logic error: missing boundary
            }
        });

        console.log('Signup Success:', response.data);
    } catch (error) {
        // We expect this to fail or timeout or return 400/500 depending on how multer handles it
        if (error.response) {
            console.log('EXPECTED FAILURE - Response Status:', error.response.status);
            console.log('EXPECTED FAILURE - Response Data:', error.response.data);
        } else {
            console.log('EXPECTED FAILURE - Error Message:', error.message);
        }
    }
}

testSignupWithBadHeader();
