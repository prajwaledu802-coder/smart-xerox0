const express = require('express');
const router = express.Router();
const { Order, Payment } = require('../models');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `payment-${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post('/verify', upload.single('screenshot'), async (req, res) => {
    const { orderId, amount, transactionId, method } = req.body;
    try {
        const order = await Order.findByPk(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        if (method === 'cash') {
            order.paymentStatus = 'pending';
            order.instructions = (order.instructions || '') + ' [CoD Selected]';
            await order.save();

            await Payment.create({
                orderId,
                amount: 0,
                method: 'cash',
                transactionId: 'COD-PENDING'
            });

            return res.json({ success: true, message: 'CoD confirmed', order });
        }

        let finalTxnId = transactionId || `TXN-${Date.now()}`;
        if (req.file) {
            console.log("Payment Screenshot:", req.file.path);
            finalTxnId += ` | IMG: /uploads/${req.file.filename}`;
        }

        await Payment.create({
            orderId,
            amount: parseFloat(amount),
            method: 'upi',
            transactionId: finalTxnId
        });

        order.amountPaid += parseFloat(amount);
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
