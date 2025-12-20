const { Sequelize } = require('sequelize');
const path = require('path');

const getDatabaseUrl = () => {
    let url = process.env.DATABASE_URL;
    if (!url) return null;

    // 1. Force string and trim
    url = String(url).trim();

    // 2. Remove "psql" command prefix if user copied it
    if (url.startsWith('psql')) {
        url = url.replace(/^psql\s*/, '');
    }

    // 3. Remove surrounding quotes (single or double)
    url = url.replace(/^['"]+|['"]+$/g, '');

    // 4. Debug Log (Redacted)
    if (url.length > 10) {
        console.log(`[Config] Using DATABASE_URL starting with: ${url.substring(0, 15)}...`);
    } else {
        console.error('[Config] DATABASE_URL is suspiciously short!');
    }

    return url;
};

const dbUrl = getDatabaseUrl();
const isProduction = process.env.NODE_ENV === 'production' || !!dbUrl;

console.log(`[Config] Running in ${isProduction ? 'PRODUCTION (Cloud DB)' : 'DEVELOPMENT (SQLite)'} mode.`);

const sequelize = isProduction && dbUrl
    ? new Sequelize(dbUrl, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../database_v2.sqlite'),
        logging: false
    });

module.exports = sequelize;
