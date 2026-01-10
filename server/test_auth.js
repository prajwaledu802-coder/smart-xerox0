const axios = require('axios');

const API_URL = 'http://localhost:5000/auth';

const testSignup = async () => {
    try {
        console.log('Testing Mobile Signup...');
        const res = await axios.post(`${API_URL}/mobile-signup`, {
            name: 'Test User',
            mobile: '1231231234'
        });
        console.log('Signup Success:', res.data);
    } catch (err) {
        console.error('Signup Failed:', err.response ? err.response.data : err.message);
    }
};

testSignup();
