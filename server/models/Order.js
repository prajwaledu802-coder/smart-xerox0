const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        fileUrl: String,
        fileName: String,
        printType: {
            type: String,
            enum: ['bw', 'color'],
            default: 'bw'
        },
        pages: Number,
        copies: {
            type: Number,
            default: 1
        },
        paperSize: {
            type: String,
            default: 'A4'
        },
        amount: Number
    }],
    amountTotal: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'paid'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['received', 'printing', 'ready', 'delivered'],
        default: 'received'
    },
    invoiceUrl: String,
    instructions: String
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
