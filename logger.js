'use strict'
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const util = require('util');
require('winston-daily-rotate-file');

var _file = new (transports.DailyRotateFile)({
    filename: 'logs_%DATE%',
    dirname: './logs/',
    extension: '.log',
    zippedArchive: true,
    maxSize: '5m'
});

var _printf_col = format.printf((info) => {
    const timestamp = info.timestamp.trim();
    const level = info.level;
    const message = (info.message || '').trim();
    const args = info[Symbol.for('splat')];
    const strArgs = (args || []).map((arg) => {
        return util.inspect(arg, {
            colors: true
        });
    }).join(' ');
    return `${timestamp} [${level}] - ${message} ${strArgs}`;
})

var _printf = format.printf((info) => {
    const timestamp = info.timestamp.trim();
    const level = info.level;
    const message = (info.message || '').trim();
    const args = info[Symbol.for('splat')];
    const strArgs = (args || []).map((arg) => {
        return util.inspect(arg, {
            colors: false
        });
    }).join(' ');
    return `${timestamp} [${level}] - ${message} ${strArgs}`;
})

var _format = format.combine(
        format.colorize(),
        format.timestamp(),
        _printf_col
        /* format.printf(log => {
            return `${log.timestamp} ${log.level} ${log.message}`;
        }) */
    );

var _console = new transports.Console({
    format: _format
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        _printf
    ),
    transports: [_file, _console]
});

// console override
/* console.log = logger.info;
console.info = logger.info;
console.error = logger.error;
console.warn = logger.warn; */
// module export
exports.logger = logger;
