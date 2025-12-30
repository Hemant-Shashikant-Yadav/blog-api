import winston from 'winston';
import colors from 'colors';

import config from '@/config';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

// Define transport array to hold different logging transports
const transports: winston.transport[] = [];

// If application is not running in production, add a console transport
if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console()
  );
}

// Create a logger instance with the defined transports
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss A',
    }),
    errors({ stack: true }),
    printf(({ timestamp, level, message, ...meta }) => {
      const metaString = Object.keys(meta).length
        ? `\n${JSON.stringify(meta)}`
        : '';
      
      // Color timestamp and level based on log level
      const coloredTimestamp = colors.cyan(`[${timestamp}]`);
      let coloredLevel;
      
      switch (level) {
        case 'error':
          coloredLevel = colors.red.bold(level.toUpperCase());
          break;
        case 'warn':
          coloredLevel = colors.yellow.bold(level.toUpperCase());
          break;
        case 'info':
          coloredLevel = colors.green.bold(level.toUpperCase());
          break;
        case 'debug':
          coloredLevel = colors.blue.bold(level.toUpperCase());
          break;
        default:
          coloredLevel = colors.white.bold(level.toUpperCase());
      }
      
      return `\n${coloredTimestamp} ${coloredLevel}: ${message}${metaString}`;
    })
  ),
  transports,
  silent: config.NODE_ENV === 'test',
});

export { logger };
