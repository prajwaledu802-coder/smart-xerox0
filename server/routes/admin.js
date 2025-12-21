const express = require('express');
const router = express.Router();
const { Order, User, OrderItem } = require('../models');
const { sendWhatsAppMessage } = require('../services/whatsapp');
const { generateInvoice } = require('../services/invoiceGenerator');

router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email', 'mobile'] },
                { model: OrderItem, as: 'items' }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.patch('/order/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [{ model: User }]
        });

        if (!order) return res.status(404).json({ error: 'Order not found' });

        order.orderStatus = status;
        await order.save();

        const userPhone = order.User?.mobile || 'Unknown';
        const userName = order.User?.name || 'User';

        if (status === 'ready') {
            const invoicePath = await generateInvoice(order, order.User);
            order.invoiceUrl = invoicePath;
            await order.save();

            await sendWhatsAppMessage(userPhone, `Hi ${userName}, your order #${order.id} is ACCEPTED. Invoice: ${invoicePath}`);
        } else if (status === 'delivered') {
            await sendWhatsAppMessage(userPhone, `Hi ${userName}, your order #${order.id} is DELIVERED. Thank you!`);
            console.log(`[ADMIN LOG] Order #${order.id} delivered at ${new Date().toISOString()}`);
        }

        res.json({ success: true, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
