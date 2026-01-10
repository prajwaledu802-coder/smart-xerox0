const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = (order, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const filename = `Invoice-${order.id}-${Date.now()}.pdf`;
            const filePath = path.join(__dirname, '../uploads', filename); // Save to uploads for public access
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Header
            doc.fontSize(20).text('Smart Xerox', { align: 'center' });
            doc.fontSize(12).text('Invoice', { align: 'center' });
            doc.moveDown();

            // Customer Details
            doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
            doc.text(`Order ID: #${order.id}`);
            doc.text(`Customer Name: ${user.name || 'Guest'}`);
            doc.text(`Customer ID: ${user.id || 'N/A'}`);
            doc.moveDown();

            // Line Items
            doc.text('-------------------------------------------------------');
            doc.text('Description                                   Amount');
            doc.text('-------------------------------------------------------');

            if (order.items && order.items.length > 0) {
                order.items.forEach(item => {
                    const desc = `${item.fileName} (${item.pages}pgs x ${item.copies})`;
                    doc.text(`${desc.substring(0, 40).padEnd(45)} Rs. ${item.amount}`);
                });
            } else {
                doc.text(`Printing Services                             Rs. ${order.amountTotal}`);
            }

            doc.moveDown();
            doc.text('-------------------------------------------------------');

            // Totals
            const total = order.amountTotal;
            const paid = total / 2; // 50% paid logic
            const remaining = total - paid;

            doc.font('Helvetica-Bold');
            doc.text(`Total Amount: Rs. ${total.toFixed(2)}`, { align: 'right' });
            doc.text(`Paid (50% Advance): Rs. ${paid.toFixed(2)}`, { align: 'right' });
            doc.fillColor('red').text(`Remaining Balance: Rs. ${remaining.toFixed(2)}`, { align: 'right' });

            doc.end();

            stream.on('finish', () => {
                // Return relative URL
                resolve(`/uploads/${filename}`);
            });

            stream.on('error', (err) => {
                reject(err);
            });

        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { generateInvoice };
