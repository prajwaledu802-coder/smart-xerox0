const express = require('express');
const router = express.Router();
const { Order, OrderItem } = require('../models');
const multer = require('multer');
const path = require('path');
const { sendWhatsAppMessage } = require('../services/whatsapp');
const verifyToken = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// @route   GET /orders/myorders
router.get('/myorders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            include: 'items'
        });
        res.json({ success: true, orders });
    } catch (err) {
        console.error("MyOrders Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   POST /orders
router.post('/', upload.array('files'), async (req, res) => {
    try {
        let { userId, items, amountTotal, instruction } = req.body;

        if (userId === 'guest' || userId === 'null' || !userId) {
            // userId = null; // In Sequelize strict mode, might default to null if allowed, but usually needs a User record or foreign key constraint match. 
            // If Guest is allowed, we might need a dummy guest user or make column nullable.
            // Assuming auth is required or strict FK. For now fail if no user.
            return res.status(400).json({ success: false, error: "User ID is required" });
        }

        let orderItemsData = [];
        if (req.body.orderData) {
            orderItemsData = JSON.parse(req.body.orderData);
        }

        const order = await Order.create({
            userId,
            amountTotal: parseFloat(amountTotal),
            instructions: instruction,
            fileName: req.files && req.files.length > 0 ? `${req.files.length} Items` : 'Multi-Item Order',
            amountPaid: 0,
            paymentStatus: 'pending',
            orderStatus: 'received'
        });

        if (req.files && req.files.length > 0) {
            const promises = req.files.map(async (file, index) => {
                const meta = orderItemsData[index] || {};
                return OrderItem.create({
                    orderId: order.id,
                    fileUrl: `/uploads/${file.filename}`,
                    fileName: file.originalname,
                    printType: meta.printType || 'bw',
                    pages: meta.pages || 0,
                    copies: meta.copies || 1,
                    paperSize: meta.paperSize || 'A4',
                    amount: meta.amount || 0
                });
            });
            await Promise.all(promises);
        }

        const ADMIN_PHONE = '919916220476';
        const itemsSummary = req.files ? `${req.files.length} Files` : 'Items';
        const msg = `🔔 *New Order Received!* \nOrder #${order.id}\nUser: ${userId}\nItems: ${itemsSummary}\nTotal: Rs.${amountTotal}\n\nCheck Admin Panel to Accept.`;

        await sendWhatsAppMessage(ADMIN_PHONE, msg);

        res.status(201).json({ success: true, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   GET /orders/user/:userId
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']],
            include: ['items']
        });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   GET /orders/:id
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: ['User', 'items'] // Check if 'User' alias works (default is table name based usually)
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
