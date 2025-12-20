const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const User = require('./User'); // Moved to index.js

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Legacy/Single Item fields (made nullable for backward compatibility)
    fileUrl: { type: DataTypes.STRING, allowNull: true },
    fileName: { type: DataTypes.STRING, allowNull: true },
    printType: { type: DataTypes.ENUM('bw', 'color'), defaultValue: 'bw' },
    pages: { type: DataTypes.INTEGER, allowNull: true },
    copies: { type: DataTypes.INTEGER, defaultValue: 1 },

    // Order Level Fields
    amountTotal: { type: DataTypes.FLOAT, allowNull: false },
    amountPaid: { type: DataTypes.FLOAT, defaultValue: 0 },
    paymentStatus: { type: DataTypes.ENUM('pending', 'partial', 'paid'), defaultValue: 'pending' },
    orderStatus: { type: DataTypes.ENUM('received', 'printing', 'ready', 'delivered'), defaultValue: 'received' },
    invoiceUrl: { type: DataTypes.STRING, allowNull: true },
    instructions: { type: DataTypes.TEXT }
});

// Associations
// Associations moved to index.js to prevent circular dependencies
// Order.belongsTo(User, { foreignKey: 'userId' });
// User.hasMany(Order, { foreignKey: 'userId' });
// Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
// OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Order;
