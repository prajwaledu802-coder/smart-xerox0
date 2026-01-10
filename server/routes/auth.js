const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Import from index for associations
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const { admin } = require('../config/firebase'); // Import Firebase Admin

// Multer for Avatar
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /auth/firebase-sync
// @desc    Sync Firebase User creation with local DB (Signup Flow)
router.post('/firebase-sync', upload.single('avatar'), async (req, res) => {
    try {
        const { name, email, mobile, firebaseUid } = req.body;
        const idToken = req.headers.authorization?.split('Bearer ')[1];

        if (!idToken) {
            return res.status(401).json({ success: false, error: 'No token provided' });
        }

        // Verify Firebase Token
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            if (decodedToken.uid !== firebaseUid) {
                return res.status(403).json({ success: false, error: 'Token UID mismatch' });
            }
        } catch (authError) {
            console.error("Firebase Token Verification Failed:", authError);
            return res.status(401).json({ success: false, error: 'Invalid Firebase Token' });
        }

        // Check if user exists in legacy DB by email
        let user = await User.findOne({ where: { email } });

        if (user) {
            // Update existing user with firebaseUid
            user.firebaseUid = firebaseUid;
            // Update other fields if provided (optional)
            if (mobile) user.mobile = mobile;
            if (req.file) user.avatar = `/uploads/${req.file.filename}`;
            await user.save();
        } else {
            // Create new user linked to Firebase
            user = await User.create({
                name,
                email,
                mobile: mobile || '', // Ensure mobile is handled if optional
                password: 'FIREBASE_AUTH', // Dummy password
                firebaseUid,
                avatar: req.file ? `/uploads/${req.file.filename}` : null
            });
        }

        res.status(201).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, firebaseUid: user.firebaseUid },
            token: generateToken(user.id) // Return local JWT for legacy endpoints
        });

    } catch (err) {
        console.error("Firebase Sync Error:", err);
        if (err.code && err.code.startsWith('auth/')) {
            return res.status(401).json({ success: false, error: 'Invalid Firebase Token' });
        }
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   POST /auth/firebase-login
// @desc    Login via Firebase Token
router.post('/firebase-login', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) return res.status(400).json({ success: false, error: 'Token is required' });

        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email, uid, picture } = decodedToken;

        let user = await User.findOne({ where: { email } });

        if (!user) {
            // If user doesn't exist but has valid Firebase Token, we could auto-create or ask to signup
            // For now, let's treat it as user not found in our system, or auto-create basic record
            // Let's auto-create minimal record
            user = await User.create({
                name: decodedToken.name || 'User',
                email,
                mobile: '', // Placeholder
                password: 'FIREBASE_AUTH',
                firebaseUid: uid,
                avatar: picture || null
            });
        } else {
            // Update firebaseUid if missing
            if (!user.firebaseUid) {
                user.firebaseUid = uid;
                await user.save();
            }
        }

        res.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role },
            token: generateToken(user.id)
        });

    } catch (err) {
        console.error("Firebase Login Error:", err);
        // Differentiate errors
        if (err.code && err.code.startsWith('auth/')) {
            return res.status(401).json({ success: false, error: 'Invalid Firebase Token', details: err.message });
        }
        // Database or other server errors should be 500
        res.status(500).json({ success: false, error: 'Server Internal Error', details: err.message });
    }
});

// Legacy Routes (Optional: keep or deprecate)
// @route   POST /auth/signup
router.post('/signup', upload.single('avatar'), async (req, res) => {
    // ... keep existing implementation or remove if fully switching ...
    // For safety, preserving logic but it's largely bypassed by frontend now.
    try {
        const { name, email, mobile, password } = req.body;

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) return res.status(400).json({ success: false, error: 'Email already exists' });

        const existingMobile = await User.findOne({ where: { mobile } });
        if (existingMobile) return res.status(400).json({ success: false, error: 'Mobile number already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword,
            avatar: req.file ? `/uploads/${req.file.filename}` : null
        });

        res.status(201).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
            token: generateToken(user.id)
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log('Login Attempt:', { email, password });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid Credentials' });

        res.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, role: user.role },
            token: generateToken(user.id)
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
