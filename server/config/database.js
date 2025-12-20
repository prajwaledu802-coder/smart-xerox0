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

    // 3. Remove surrounding quotes
    url = url.replace(/^['"]+|['"]+$/g, '');

    // 4. Validate Protocol
    if (!url.startsWith('postgres://') && !url.startsWith('postgresql://')) {
        console.error(`[Config] ERROR: DATABASE_URL is invalid (missing protocol). Starts with: ${url.substring(0, 10)}...`);
        return null; // Fallback to SQLite
    }

    console.log(`[Config] Using valid Cloud DB URL.`);
    return url;
};

const dbUrl = getDatabaseUrl();
// Only use Production mode if we actually have a VALID Cloud DB URL
const isProduction = (process.env.NODE_ENV === 'production') && !!dbUrl;

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
