const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Keep these for backward compat or single-file orders, but mostly rely on Items
    fileName: { type: DataTypes.STRING, allowNull: true },

    amountTotal: { type: DataTypes.FLOAT, allowNull: false },
    amountPaid: { type: DataTypes.FLOAT, defaultValue: 0 },
    paymentStatus: { type: DataTypes.ENUM('pending', 'partial', 'paid'), defaultValue: 'pending' },
    orderStatus: { type: DataTypes.ENUM('received', 'printing', 'ready', 'delivered'), defaultValue: 'received' },
    invoiceUrl: { type: DataTypes.STRING, allowNull: true },
    instructions: { type: DataTypes.TEXT }
});

module.exports = Order;
