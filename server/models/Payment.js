const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    method: { type: DataTypes.STRING, defaultValue: 'upi' },
    transactionId: { type: DataTypes.STRING },
});

module.exports = Payment;
