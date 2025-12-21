const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const multer = require('multer');
const path = require('path');

// Multer Setup for Screenshots
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `payment-${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// @route   POST /payment/verify
// @desc    Verify payment and update order
router.post('/verify', upload.single('screenshot'), async (req, res) => {
    const { orderId, amount, transactionId, method } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        if (method === 'cash') {
            // Cash on Delivery Flow
            order.paymentStatus = 'pending';
            order.instructions = (order.instructions || '') + ' [CoD Selected]';
            await order.save();

            // Optionally create a payment record
            await Payment.create({
                orderId,
                amount: 0,
                method: 'cash',
                transactionId: 'COD-PENDING'
            });

            return res.json({ success: true, message: 'CoD confirmed', order });
        }

        // Online / UPI Flow
        let finalTxnId = transactionId || `TXN-${Date.now()}`;

        // If screenshot uploaded
        if (req.file) {
            console.log("Payment Screenshot:", req.file.path);
            finalTxnId += ` | IMG: /uploads/${req.file.filename}`;
        }

        // Create Payment Record
        const payment = await Payment.create({
            orderId,
            amount: parseFloat(amount),
            method: 'upi',
            transactionId: finalTxnId
        });

        // Update Order
        order.amountPaid += parseFloat(amount);
        // Simple logic: if paid >= 50% of total
        if (order.amountPaid >= order.amountTotal / 2) {
            order.paymentStatus = order.amountPaid >= order.amountTotal ? 'paid' : 'partial';
        }
        await order.save();

        res.json({ success: true, message: 'Payment verified', order });
    } catch (err) {
        console.error("Payment Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
