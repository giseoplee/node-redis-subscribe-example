module.exports = {
    redis: {
        redisHost: "0.0.0.0",
        redisPort: 6379,
        redisDatabase: 1,
        redisPassword: "your_password",
        conversationLogDB: 2
    },
    mongo: {
        url: '0.0.0.0',
        port: 27000,
        database: 'dbname',
        auth: {
            user: 'user',
            passwd: 'your_password'
        }
    }
}