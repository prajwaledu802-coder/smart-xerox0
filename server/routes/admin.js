const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { sendWhatsAppMessage } = require('../services/whatsapp');
const { generateInvoice } = require('../services/invoiceGenerator');

// @route   GET /admin/orders
// @desc    Get all orders with User and Items
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'id name email mobile')
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   PATCH /admin/order/:id
// @desc    Update order status
router.patch('/order/:id', async (req, res) => {
    const { status } = req.body; // 'ready' (Accepted), 'delivered'
    try {
        const order = await Order.findById(req.params.id).populate('user');

        if (!order) return res.status(404).json({ error: 'Order not found' });

        order.orderStatus = status;
        await order.save();

        // WhatsApp Alert Logic
        const userPhone = order.user?.mobile || 'Unknown';
        const userName = order.user?.name || 'User';

        if (status === 'ready') {
            // Generate Invoice
            // Note: generateInvoice needs to support Mongoose Order object
            const invoicePath = await generateInvoice(order, order.user);
            order.invoiceUrl = invoicePath;
            await order.save(); // Save invoice path

            await sendWhatsAppMessage(userPhone, `Hi ${userName}, your order #${order._id} is ACCEPTED. Invoice: ${invoicePath}`);
        } else if (status === 'delivered') {
            await sendWhatsAppMessage(userPhone, `Hi ${userName}, your order #${order._id} is DELIVERED. Thank you!`);
            console.log(`[ADMIN LOG] Order #${order._id} delivered at ${new Date().toISOString()}`);
        }

        res.json({ success: true, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
