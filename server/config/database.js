const { Sequelize } = require('sequelize');
const path = require('path');

// Check for DATABASE_URL environment variable (from Render/Vercel/Heroku)
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
    // Production: Use PostgreSQL
    console.log("Using PostgreSQL Database");
    sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false, // Reduce logs in production
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Required for some cloud DB providers
            }
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    // Local / Fallback: Use SQLite
    console.log("Using SQLite Database (Local)");
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../database.sqlite'),
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
}

module.exports = sequelize;
