module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: '7learn',
        dialect: 'postgres',
        logging: false,
    },
};
