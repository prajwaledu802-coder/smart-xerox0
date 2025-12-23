const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000';

async function runTest() {
    console.log("🚀 Starting Comprehensive Backend Test...");
    let token = null;
    let userId = null;

    // 1. Signup
    try {
        const unique = Date.now();
        console.log(`\n1. Testing Signup (TestUser${unique})...`);
        const signupRes = await axios.post(`${API_URL}/auth/signup`, {
            name: `TestUser${unique}`,
            email: `user${unique}@test.com`,
            mobile: `888${unique.toString().slice(-7)}`,
            password: 'password123'
        });
        if (signupRes.data.success) {
            console.log("✅ Signup PASSED");
            userId = signupRes.data.user.id;
        } else {
            throw new Error("Signup Failed");
        }
    } catch (err) {
        console.error("❌ Signup FAILED:", err.response?.data || err.message);
        return;
    }

    // 2. Login
    try {
        console.log(`\n2. Testing Login...`);
        // Use the email/password from signup step (reconstructed)
        // Actually, let's just use the credentials we just created.
        const unique = userId.toString(); // Wait, I need the email.
        // Let's store credentials.
    } catch (err) { }
}

// Rewriting for proper scope
async function runFullFlow() {
    const unique = Date.now();
    const email = `flow${unique}@test.com`;
    const password = 'password123';
    let token = '';

    // 1. Signup
    try {
        console.log("STEP 1: Signup");
        const res = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Flow User',
            email,
            mobile: `777${unique.toString().slice(-7)}`,
            password
        });
        console.log("✅ Signup OK");
    } catch (e) {
        console.error("❌ Signup Failed", e.response?.data || e.message);
        process.exit(1);
    }

    // 2. Login
    try {
        console.log("STEP 2: Login");
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        token = res.data.token;
        console.log("✅ Login OK. Token received.");
    } catch (e) {
        console.error("❌ Login Failed", e.response?.data || e.message);
        process.exit(1);
    }

    // 3. Create Order
    try {
        console.log("STEP 3: Create Order");
        const form = new FormData();
        form.append('userId', '1'); // Actually usually we use the logged in user ID or token extract?
        // The endpoint uses req.body.userId manually or token? 
        // Order routes: router.post('/', upload.array('files'), ... const { userId ... } = req.body)
        // It does NOT use verifyToken middleware on POST /orders (based on my previous view).
        // Let's create a dummy text file
        fs.writeFileSync('test.txt', 'Hello World');
        form.append('files', fs.createReadStream('test.txt'));
        form.append('userId', '1'); // Using ID 1 or validation might fail if table empty... let's use the one we signed up?
        // But login returned user.id.
        // Let's fetch user ID from login response or /auth/me if exists.
        // Login res has user object.
    } catch (e) { }

}

// Let's write a simpler version that just flows naturally.
const test = async () => {
    const unique = Date.now();
    const email = `auto${unique}@test.com`;
    const password = 'password123';

    console.log("--- BUCKLE UP! STARTING TESTS ---");

    // SIGNUP
    let user;
    try {
        const res = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Auto Tester', email, mobile: `555${unique.toString().slice(-7)}`, password
        });
        user = res.data.user;
        console.log("✅ Signup: OK");
    } catch (e) { console.error("❌ Signup:", e.response?.data || e.message); return; }

    // LOGIN
    let token;
    try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        token = res.data.token;
        console.log("✅ Login: OK");
    } catch (e) { console.error("❌ Login:", e.response?.data || e.message); return; }

    // CREATE ORDER
    try {
        fs.writeFileSync('dummy.pdf', 'dummy content');
        const form = new FormData();
        form.append('userId', user.id);
        form.append('amountTotal', 100);
        form.append('instruction', 'Test Order');
        form.append('files', fs.createReadStream('dummy.pdf'));

        // Need headers for multipart
        const res = await axios.post(`${API_URL}/orders`, form, {
            headers: { ...form.getHeaders() }
        });
        console.log("✅ Create Order: OK (Order ID: " + res.data.order.id + ")");
    } catch (e) { console.error("❌ Create Order:", e.response?.data || e.message); fs.unlinkSync('dummy.pdf'); return; }

    // FETCH ORDERS
    try {
        const res = await axios.get(`${API_URL}/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.orders.length > 0) console.log("✅ Fetch Orders: OK");
        else console.error("❌ Fetch Orders: Returned empty list");
    } catch (e) { console.error("❌ Fetch Orders:", e.response?.data || e.message); }

    fs.unlinkSync('dummy.pdf');
    console.log("\n🎉 ALL SYSTEMS GO!");
};

test();
