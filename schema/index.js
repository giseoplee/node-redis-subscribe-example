const mongoose = require('mongoose');
const moment = require('moment');
const { Schema } = mongoose;

const userContextSchema = new Schema({
    userKey: { type: String, required: true },
    botId: { type: Number, required: true },
    utterances: { type: Array, required: true },
    intent_log: { type: Array, required: true },
    recent: { type: String, required: true },
    createdAt: { type: Date, default: moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'), required: false }
});

const loggingErrorSchema = new Schema({
    error: { type: String, required: true },
    createdAt: { type: Date, default: moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'), required: true }
});

module.exports = {
    userContext: mongoose.model('userContext', userContextSchema),
    logingError: mongoose.model('logingError', loggingErrorSchema)
};