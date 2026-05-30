import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import type { LoggerOptions } from 'winston';

/**
 * TODO: Implement transport configuration.
 *
 * This function decides WHERE logs go and HOW they're formatted.
 * It runs once at startup — return a LoggerOptions object.
 *
 * Key trade-offs to consider:
 *
 *  Console-only (json format)
 *    → Simple, works on Railway/cloud log collectors out of the box.
 *    → No disk I/O, easy to tail in production.
 *
 *  Console (pretty) + File (json)
 *    → Great local DX — colorized console for humans, structured file for
 *      machines / log-shipping agents.
 *    → Files can fill disk on Railway; use only in local dev or with rotation.
 *
 *  Console + rotating files (winston-daily-rotate-file)
 *    → Full production-grade setup. Needs an extra package.
 *
 * Typical starting point:
 *
 *   const isDev = process.env.NODE_ENV !== 'production';
 *   return {
 *     level: isDev ? 'debug' : 'info',
 *     transports: [
 *       new transports.Console({
 *         format: isDev
 *           ? format.combine(format.colorize(), format.simple())
 *           : format.combine(format.timestamp(), format.json()),
 *       }),
 *     ],
 *   };
 */
function createWinstonOptions(): LoggerOptions {
  // TODO: replace this stub with your transport configuration (5–10 lines)
  return {
    level: 'info',
    transports: [new transports.Console({ format: format.simple() })],
  };
}

@Global()
@Module({
  imports: [WinstonModule.forRoot(createWinstonOptions())],
  exports: [WinstonModule],
})
export class LoggerModule {}
