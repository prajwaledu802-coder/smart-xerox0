const admin = require("firebase-admin");
const path = require("path");

try {
    const serviceAccount = require("./serviceAccountKey.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "smart-xeroxdb.firebasestorage.app"
    });

    console.log("Firebase Admin Initialized Successfully");
} catch (error) {
    console.error("FIREBASE INIT ERROR: Could not load serviceAccountKey.json from server/config/");
    console.error("Please ensure the file exists and is valid JSON.");
    console.error(error.message);
    // We don't crash the process here to allow other parts of the server to potentially work, 
    // but DB operations will fail.
}

const db = admin.firestore();

module.exports = { admin, db };
