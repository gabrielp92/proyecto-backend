const log4js = require('log4js')

log4js.configure({
    appenders: {
        myLoggerConsole: {type : 'console'},
        myLoggerFileWarn: {type: 'file', filename: 'warn.log'},
        myLoggerFileError: {type: 'file', filename: 'error.log'}
    },
    categories: {
        default: {appenders: ['myLoggerConsole'], level: 'info'},
        warning: {appenders: ['myLoggerConsole', 'myLoggerFileWarn'], level: 'warn'},
        error: {appenders: ['myLoggerConsole', 'myLoggerFileError'], level:'error'}
    }
})

/** 
 * trace
 * debug
 * info
 * warn
 * error
 * fatal
*/

/*
const typeLog = (process.env.NODE_ENV == 'production') ? 'prod' : 'console'
const logger2 = log4js.getLogger(typeLog)
*/

const loggerInfo = log4js.getLogger('default')
const loggerWarning = log4js.getLogger('warning')
const loggerError = log4js.getLogger('error')

module.exports = {
    loggerInfo,
    loggerWarning,
    loggerError
}