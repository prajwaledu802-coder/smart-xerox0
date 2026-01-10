const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/', (req, res) => {
    res.json({ status: 'running', database: process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite' });
});

async function startServer() {
    try {
        // Import models and routes
        const { sequelize } = require('./models');

        app.use('/auth', require('./routes/auth'));
        app.use('/orders', require('./routes/orders'));
        app.use('/payment', require('./routes/payment'));
        app.use('/invoice', require('./routes/invoice'));
        app.use('/admin', require('./routes/admin'));

        const PORT = process.env.PORT || 5000;

        console.log('Attempting to sync Database...');
        await sequelize.sync({ alter: false });
        console.log('Database Synced.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('SERVER FATAL ERROR:', err);
    }
}

// Handle Crashes
process.on('uncaughtException', (err) => console.error('UNCAUGHT EXCEPTION:', err));
process.on('unhandledRejection', (reason) => console.error('UNHANDLED REJECTION:', reason));

startServer();
