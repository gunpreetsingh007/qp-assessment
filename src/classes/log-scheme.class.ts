import winston from 'winston';
import 'winston-daily-rotate-file';

// Define log levels
const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Define log colors
const LOG_COLORS = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

// Define log format for console
const CONSOLE_FORMAT = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info: winston.Logform.TransformableInfo) => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Define log format for files
const FILE_FORMAT = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf((info: winston.Logform.TransformableInfo) => `${info.timestamp} ${info.level}: ${info.message}`),
    winston.format.json()
);

// Define log transports
const TRANSPORTS = [
    new winston.transports.Console({
        format: CONSOLE_FORMAT,
    }),
    new winston.transports.DailyRotateFile({
        dirname: "logs",
        filename: `${process.cwd().split("/").pop()}-%DATE%-logs.log`,
        maxSize: "10mb",
        maxFiles: "5",
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        format: FILE_FORMAT,
    })
];

// Determine log level based on environment
const getLogLevel = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'warn';
};

// Add colors to winston
winston.addColors(LOG_COLORS);

// Create and export logger
export const LogScheme = winston.createLogger({
    level: getLogLevel(),
    levels: LOG_LEVELS,
    transports: TRANSPORTS
});