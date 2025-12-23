import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXidpK1Me8XzukqZiT3h59gfSJrkK8B_w",
    authDomain: "smart-xeroxdb.firebaseapp.com",
    projectId: "smart-xeroxdb",
    storageBucket: "smart-xeroxdb.firebasestorage.app",
    messagingSenderId: "222665227318",
    appId: "1:222665227318:web:297b78e2ac291856216c97",
    measurementId: "G-GVVZ7Y0DQJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
