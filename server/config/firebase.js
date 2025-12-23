const admin = require("firebase-admin");
const path = require("path");

try {
    let serviceAccount;

    // 1. Try loading from Environment Variable (Render/Production specific)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            // If it's a string, parse it.
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            console.log("Loaded Firebase Credentials from Environment Variable");
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var", e);
        }
    }

    // 2. If not in Env, try loading from local file (Dev specific)
    if (!serviceAccount) {
        try {
            serviceAccount = require("./serviceAccountKey.json");
            console.log("Loaded Firebase Credentials from local file");
        } catch (e) {
            console.log("Local serviceAccountKey.json not found, checking Env...");
        }
    }

    if (!serviceAccount) {
        throw new Error("No serviceAccount credential found (Env or File).");
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "smart-xeroxdb.firebasestorage.app"
    });

    console.log("Firebase Admin Initialized Successfully");
} catch (error) {
    console.error("FIREBASE INIT ERROR: Could not load credentials.");
    console.error(error.message);
}

const db = admin.firestore();

module.exports = { admin, db };
