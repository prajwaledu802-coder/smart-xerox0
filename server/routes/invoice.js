const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Order = require('../models/Order');
const User = require('../models/User'); // Ensure User model is loaded
const fs = require('fs');
const path = require('path');

// @route   GET /invoice/:orderId
// @desc    Generate Invoice PDF
router.get('/:orderId', async (req, res) => {
    try {
        // Sequelize: findByPk, include User and Items
        const order = await Order.findByPk(req.params.orderId, {
            include: [User, 'items']
        });

        if (!order) return res.status(404).json({ error: 'Order not found' });

        const doc = new PDFDocument();
        const filename = `invoice-${order.id}.pdf`;

        // Stream to Client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        doc.pipe(res);

        // Header
        doc.fontSize(25).fillColor('#4F46E5').text('Smart Xerox', { align: 'center' });
        doc.fontSize(10).fillColor('black').text('Premium Printing Service', { align: 'center' });
        doc.moveDown();
        doc.moveDown();

        // Order Details (Left) vs Customer (Right) - Simplified for speed
        doc.fontSize(12).font('Helvetica-Bold').text('Invoice Details');
        doc.font('Helvetica').fontSize(10);
        doc.text(`Invoice ID: #INV-${order.id}`);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
        doc.moveDown();

        doc.fontSize(12).font('Helvetica-Bold').text('Bill To:');
        doc.font('Helvetica').fontSize(10);
        doc.text(order.User ? order.User.name : 'Guest Customer');
        doc.text(order.User ? order.User.email : '-');
        doc.moveDown();
        doc.moveDown();

        // Table Header
        const tableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Item / File', 50, tableTop);
        doc.text('Type', 250, tableTop);
        doc.text('Pages', 350, tableTop);
        doc.text('Amount', 450, tableTop, { align: 'right' });

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
        doc.font('Helvetica');
        let y = tableTop + 25;

        // Items Loop
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                doc.text(item.fileName || 'Document', 50, y, { width: 180, ellipsis: true });
                doc.text(item.printType.toUpperCase(), 250, y);
                doc.text(`${item.pages} x ${item.copies}`, 350, y);
                doc.text(`Rs. ${item.amount}`, 450, y, { align: 'right' });
                y += 20;
            });
        } else {
            // Fallback for legacy orders
            doc.text(order.fileName || 'Generic Order', 50, y);
            doc.text(order.printType || 'BW', 250, y);
            doc.text(order.pages || '1', 350, y);
            doc.text(`Rs. ${order.amountTotal}`, 450, y, { align: 'right' });
            y += 20;
        }

        doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
        y += 20;

        // Totals
        const total = order.amountTotal || 0;
        const paid = order.amountPaid || 0;
        const due = total - paid;

        doc.font('Helvetica-Bold');
        doc.text(`Total Amount:`, 350, y);
        doc.text(`Rs. ${total}`, 450, y, { align: 'right' });
        y += 15;

        doc.font('Helvetica');
        doc.text(`Paid:`, 350, y);
        doc.text(`Rs. ${paid}`, 450, y, { align: 'right' });
        y += 15;

        doc.fillColor('red');
        doc.text(`Balance Due:`, 350, y);
        doc.text(`Rs. ${due}`, 450, y, { align: 'right' });

        // Footer
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.fillColor('black');
        doc.fontSize(10).text('Thank you for choosing Smart Xerox.', { align: 'center', color: 'gray' });

        doc.end();

    } catch (err) {
        console.error("Invoice Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
