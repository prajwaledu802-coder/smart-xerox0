const sequelize = require('../config/database');
const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');

// Define Associations here if not already defined in model files (redundancy check)
// Assuming models define their own associations or we do it here.
// Best practice: Do it here to avoid circular dep issues in model files.

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = {
    sequelize,
    User,
    Order,
    OrderItem,
    Payment
};
