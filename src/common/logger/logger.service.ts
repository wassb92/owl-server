import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
const DailyRotateFile = require('winston-daily-rotate-file');

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const transport = new DailyRotateFile({
      filename: './logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    });

    this.logger = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf((info) => {
          const { timestamp, level, message, context, trace } = info;
          return `${timestamp} [${level}] ${
            context ? `[${context}] ` : ''
          }${message}${trace ? `\n${trace}` : ''}`;
        }),
      ),
      transports: [transport, new winston.transports.Console()],
    });

    this.logger.add(
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.printf((info) => {
            const { timestamp, level, message, context, trace } = info;
            return `${timestamp} [${level}] ${
              context ? `[${context}] ` : ''
            }${message}${trace ? `\n${trace}` : ''}`;
          }),
        ),
      }),
    );
  }

  log(message: string, context?: string) {
    this.logger.log('info', message, { context });
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(message, { context, trace });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
