const ioRedis = require('ioredis');
const util = require('util');
const moment = require('moment-timezone');
const config = require('./config');
const scheme = require('./schema');
const mongo = require('./modules/mongoose');
const { userContext, logingError } = scheme;
require('./functional');
const userSessionTTL = 60 * 60 * 24;

/**
 * 사용자 대화 내역 저장
 */
const contextDB = new ioRedis(
    {
        port: config.redis.redisPort,
        host: config.redis.redisHost,
        password: config.redis.redisPassword,
        db: 1,
        retryStrategy: function (times) {
            const delay = Math.min(times * 2, 2000);
            console.log(util.format('[Logger]::[Redis]::[Service]::[%s]::[Connection Retried User Context DB...]',
                                      moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')));
            return delay;
        }
    }
);

/**
 * TTL 확인용
 */
const subDB = new ioRedis(
  {
      port: config.redis.redisPort,
      host: config.redis.redisHost,
      password: config.redis.redisPassword,
      db: 2,
      retryStrategy: function (times) {
            const delay = Math.min(times * 2, 2000);
            log('[Logger]::[Redis]::[Service]::[%s]::[Connection Retried User Context DB...]',
                                    moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'));            
            return delay;
      }
  }
);

/**
 * context key & error 로그 저장
 */
const errorLogDB = new ioRedis(
    {
        port: config.redis.redisPort,
        host: config.redis.redisHost,
        password: config.redis.redisPassword,
        db: 3,
        retryStrategy: function (times) {
            const delay = Math.min(times * 2, 2000);
            console.log(util.format('[Logger]::[Redis]::[Service]::[%s]::[Connection Retried User Context DB...]',
                                      moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')));
            return delay;
        }
    }
);

const errorLogging = (error, key) => go(
    error,
    (errorLog, logData = {}) => mongo.create(logingError, (logData = { error: errorLog.stack }, logData)),
    _ => setError(key, JSON.stringify({ error: error.stack, timestamp: moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss') }))
);

const getValue = async key => {
    try {
        return await contextDB.get(key).then(val => val);
    } catch (error) {
        return error;
    }
};

const setValue = async (key, value, ttl) => {
    try {
        return await contextDB.set(key, JSON.stringify(value), 'ex', ttl);
    } catch (error) {
        errorLogging(error, key);
    }
};

const setError = async (key, value) => await errorLogDB.set(key, value);

subDB.psubscribe(`__keyevent@${config.redis.conversationLogDB}__:expired`, (channel, message) => {
    log('Get message [%s] from channel [%s]', message, channel);
}).catch(e => { throw e });

subDB.on('pmessage', async (channel, pattern, key) => {
    try {
        log('Receive On Key [%s] from channel [%s]', key, channel);
        let logData = await getValue(key);
        if (logData instanceof Error) throw logData;
        go(
            (logData = JSON.parse(logData), logData.userKey = key, logData),
            mongo.create(userContext),
            _ => setValue(key, { sessionTimeOut: true }, userSessionTTL)
        );
    } catch (error) {
        errorLogging(error, key);
    }
});