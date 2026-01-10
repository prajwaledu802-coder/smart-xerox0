const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');

// Associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Order.hasMany(Payment, { foreignKey: 'orderId' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = {
    sequelize,
    User,
    Order,
    OrderItem,
    Payment
};
