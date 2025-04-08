require('dotenv').config(); 

module.exports = {
    development: {
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "Yashvee@3009",
        database: process.env.DB_NAME || "jewelry_store",
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false,
        timezone: '+00:00',
        dialectOptions: {
            timezone: 'Z'
        }
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
        timezone: '+00:00',
        dialectOptions: {
            timezone: 'Z'
        }
    }
};
