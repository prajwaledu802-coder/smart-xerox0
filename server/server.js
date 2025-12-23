const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./models'); // Import sequelize instance from models/index

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', require('./routes/auth'));
app.use('/orders', require('./routes/orders'));
app.use('/payment', require('./routes/payment'));
app.use('/invoice', require('./routes/invoice'));
app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

// Sync Database and Start
console.log('Attempting to sync SQLite database...');
sequelize.sync({ alter: false })
    .then(() => {
        console.log('Database Synced.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('SERVER STARTUP ERROR (Sync Failed):', err);
        console.error('Stack:', err.stack);
    });
