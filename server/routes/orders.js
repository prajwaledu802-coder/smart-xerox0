const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
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
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            include: 'items' // Simple include, or { model: OrderItem, as: 'items' } if alias defined
        });
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

        // Fix: Handle 'guest' or invalid userId to prevent FK constraint error
        if (userId === 'guest' || userId === 'null' || !userId) {
            userId = null;
        }

        let orderItemsData = [];
        if (req.body.orderData) {
            orderItemsData = JSON.parse(req.body.orderData);
        }

        // Create the main Order
        const order = await Order.create({
            userId,
            amountTotal: parseFloat(amountTotal),
            instructions: instruction,
            // For backward compatibility or dashboard display, we might set the first file's info
            fileName: req.files && req.files.length > 0 ? `${req.files.length} Items` : 'Multi-Item Order',
            fileUrl: '', // Not used for multi
            printType: 'bw', // Default
            pages: 0
        });

        // Create Order Items
        if (req.files && req.files.length > 0) {
            const promises = req.files.map(async (file, index) => {
                // We need to match file to its metadata. 
                // Assumption: orderItemsData array matches the order of attached files.
                // OR: orderItemsData contains 'fileIndex' to map to req.files[fileIndex]

                const meta = orderItemsData[index] || {};

                return OrderItem.create({
                    orderId: order.id,
                    fileUrl: `/uploads/${file.filename}`,
                    fileName: file.originalname,
                    printType: meta.printType || 'bw',
                    pages: meta.pages || 0,
                    copies: meta.copies || 1,
                    amount: meta.amount || 0
                });
            });
            await Promise.all(promises);
        } else {
            // Handle non-file items if any (like just binding service without file?)
            // For now assuming files are mandatory for items
        }


        // Notify Admin via WhatsApp (Server-Side)
        // Hardcoded limit for demo, ideally from Env or DB
        const ADMIN_PHONE = '919916220476';
        const itemsSummary = req.files ? `${req.files.length} Files` : 'Items';
        const msg = `🔔 *New Order Received!* \nOrder #${order.id}\nUser: ${userId || 'Guest'}\nItems: ${itemsSummary}\nTotal: Rs.${amountTotal}\n\nCheck Admin Panel to Accept.`;

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
        const orders = await Order.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']],
            include: [{ model: OrderItem, as: 'items' }] // Include items
        });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   GET /orders/:id
// @desc    Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: ['User', { model: OrderItem, as: 'items' }]
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
