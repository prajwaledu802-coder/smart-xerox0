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
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    fileUrl: { type: DataTypes.STRING, allowNull: true },
    fileName: { type: DataTypes.STRING },
    printType: { type: DataTypes.ENUM('bw', 'color'), defaultValue: 'bw' },
    pages: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    copies: { type: DataTypes.INTEGER, defaultValue: 1 },
    amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
});

module.exports = OrderItem;
