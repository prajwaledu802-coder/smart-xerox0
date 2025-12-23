const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fileUrl: { type: DataTypes.STRING, allowNull: false },
    fileName: { type: DataTypes.STRING, allowNull: false },
    printType: { type: DataTypes.ENUM('bw', 'color'), defaultValue: 'bw' },
    pages: { type: DataTypes.INTEGER, defaultValue: 0 },
    copies: { type: DataTypes.INTEGER, defaultValue: 1 },
    paperSize: { type: DataTypes.STRING, defaultValue: 'A4' },
    amount: { type: DataTypes.FLOAT, defaultValue: 0 }
});

module.exports = OrderItem;
