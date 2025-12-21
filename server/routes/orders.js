const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const { sendWhatsAppMessage } = require('../services/whatsapp');
const verifyToken = require('../middleware/auth');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Unique filename
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// @route   GET /orders/myorders
// @desc    Get logged in user's orders
router.get('/myorders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        console.error("MyOrders Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   POST /orders
// @desc    Create new order (Multi-item support)
router.post('/', upload.array('files'), async (req, res) => {
    try {
        console.log("Files:", req.files);
        console.log("Body:", req.body);

        let { userId, items, amountTotal, instruction } = req.body;

        // Fix: Handle 'guest' or invalid userId
        if (userId === 'guest' || userId === 'null' || !userId) {
            return res.status(400).json({ success: false, error: "User ID is required" });
        }

        let orderItemsData = [];
        if (req.body.orderData) {
            orderItemsData = JSON.parse(req.body.orderData);
        }

        // Prepare embedded items array
        const embeddedItems = req.files ? req.files.map((file, index) => {
            const meta = orderItemsData[index] || {};
            return {
                fileUrl: `/uploads/${file.filename}`,
                fileName: file.originalname,
                printType: meta.printType || 'bw',
                pages: meta.pages || 0,
                copies: meta.copies || 1,
                paperSize: meta.paperSize || 'A4',
                amount: meta.amount || 0
            };
        }) : [];

        // Create the Order with embedded items
        const order = await Order.create({
            user: userId,
            items: embeddedItems,
            amountTotal: parseFloat(amountTotal),
            instructions: instruction,
            amountPaid: 0,
            paymentStatus: 'pending',
            orderStatus: 'received'
        });

        // Notify Admin via WhatsApp (Server-Side)
        const ADMIN_PHONE = '919916220476';
        const itemsSummary = embeddedItems.length > 0 ? `${embeddedItems.length} Files` : 'Items';
        const msg = `🔔 *New Order Received!* \nOrder #${order._id}\nUser: ${userId}\nItems: ${itemsSummary}\nTotal: Rs.${amountTotal}\n\nCheck Admin Panel to Accept.`;

        await sendWhatsAppMessage(ADMIN_PHONE, msg);

        res.status(201).json({ success: true, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   GET /orders/user/:userId
// @desc    Get user orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   GET /orders/:id
// @desc    Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email mobile');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
