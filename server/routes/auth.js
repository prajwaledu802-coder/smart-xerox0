const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

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

// @route   POST /auth/signup
// @desc    Register User (Password)
router.post('/signup', upload.single('avatar'), async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Check existing
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) return res.status(400).json({ success: false, error: 'Email already exists' });

        const existingMobile = await User.findOne({ where: { mobile } });
        if (existingMobile) return res.status(400).json({ success: false, error: 'Mobile number already exists' });

        // Hash Password
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
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   POST /auth/login
// @desc    Login User (Password)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login Attempt:', { email, password }); // DEBUG

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
