const config = require('../config');
const mongoose = require('mongoose');
require('../functional');

const MongooseModule = (_=> {
    try {
        const getMongoDbConnectUrl = (user, passwd, url, port, db) => `mongodb://${user}:${encodeURIComponent(passwd)}@${url}:${port}/${db}`;
        const mongo = getMongoDbConnectUrl(config.mongo.auth.user, config.mongo.auth.passwd, config.mongo.url, config.mongo.port, config.mongo.database);
        mongoose.connect(mongo, { useNewUrlParser: true });
        
        return {
            create: curry(async (scheme, data) => await go(
                data,
                data => new scheme(data),
                setSchemeObj => setSchemeObj.save().catch(error => { throw error })
            )),
            read: curry(async (scheme, options) => await go(
                options,
                ({ data, populate = false }) => !!populate
                ? scheme.find(data).populate(populate).catch(error => { throw error })
                : scheme.find(data).catch(error => { throw error })
            )),
            update: curry(async (scheme, options) => await go(
                options,
                ({ data, where = {} }) => scheme.updateMany(where, data).catch(error => { throw error })
            )),
            delete: curry(async (shceme, where) => await go(
                where,
                where => shceme.deleteMany(where).catch(error => { throw error })
            ))
        }
    } catch (error) {
        throw error;
    }
})();

module.exports = MongooseModule;
