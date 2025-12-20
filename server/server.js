const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const sequelize = require('./config/database');
require('./models'); // Load models and associations before sync

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/orders', require('./routes/orders'));
app.use('/payment', require('./routes/payment'));
app.use('/invoice', require('./routes/invoice'));
app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

// Global Error Handling
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason);
});

// Sync Database and Start Server
console.log('Attempting to connect to database...');
sequelize.authenticate()
    .then(() => {
        console.log('Database connection OK.');
        console.log('Syncing models...');
        return sequelize.sync({ alter: false }); // Disable alter to prevent potential schema locks for now
    })
    .then(() => {
        console.log('Database Synced.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('SERVER STARTUP ERROR:', err);
    });
