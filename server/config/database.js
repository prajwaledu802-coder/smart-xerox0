const { Sequelize } = require('sequelize');
const path = require('path');

const getDatabaseUrl = () => {
    let url = process.env.DATABASE_URL;
    if (!url) return null;
    // Clean up quotes if user accidentally pasted them
    url = url.trim().replace(/^['"]|['"]$/g, '');
    return url;
};

const dbUrl = getDatabaseUrl();
const isProduction = process.env.NODE_ENV === 'production' || !!dbUrl;

const sequelize = isProduction && dbUrl
    ? new Sequelize(dbUrl, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Required for some cloud DBs like Neon/Heroku
            }
        }
    })
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../database_v2.sqlite'),
        logging: false
    });

module.exports = sequelize;
