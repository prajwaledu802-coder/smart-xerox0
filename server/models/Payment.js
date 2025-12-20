const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Order = require('./Order'); // Moved to index.js

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    method: { type: DataTypes.STRING, defaultValue: 'upi' },
    transactionId: { type: DataTypes.STRING },
});

// Associations
// Associations moved to index.js
// Payment.belongsTo(Order, { foreignKey: 'orderId' });
// Order.hasMany(Payment, { foreignKey: 'orderId' });

module.exports = Payment;
