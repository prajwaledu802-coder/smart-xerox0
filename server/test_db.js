const sequelize = require('./config/database');
const User = require('./models/User');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Try to sync (this checks if we can write/read schema)
        await sequelize.sync();
        console.log('Database synced successfully.');

        // Try to find a user (checks read)
        const users = await User.findAll();
        console.log(`Found ${users.length} users.`);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

testConnection();
