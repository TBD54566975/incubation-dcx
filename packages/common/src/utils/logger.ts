/* eslint-disable no-undef */
import chalk from 'chalk';

enum Env {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

enum LogLevel {
  Debug = 'debug',
  Error = 'error',
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Test = 'test',
}

/**
 *
 * A simple console logger with colorized output.
 */
type Level = 'debug' | 'error' | 'info' | 'log' | 'warn' | 'test';
export class Logger implements Partial<Console> {
  public static env: Env = process.env.NODE_ENV as Env;
  public static isTest: boolean = Logger.env === Env.Test;
  public static isDevelopment: boolean = Logger.env === Env.Development;
  public static isProduction: boolean = Logger.env === Env.Production;

  public static level: Level = Logger.isTest ? 'test' : Logger.isDevelopment ? 'debug' : 'info';


  public static debug(message?: unknown, ...args: unknown[]): void {
    if (Logger.isTest) return;
    console.debug(chalk.green('debug') + ':', message, ...args);
  }

  public static error(message?: unknown, ...args: unknown[]): void {
    if (Logger.isTest) return;
    console.error(chalk.red('error') + ':', message, ...args);
  }

  public static info(message?: unknown, ...args: unknown[]): void {
    if (Logger.isTest) return;
    console.info(chalk.blue('info') + ':', message, ...args);
  }

  public static warn(message?: unknown, ...args: unknown[]): void {
    if (Logger.isTest) return;
    console.warn(chalk.yellow('warn') + ':', message, ...args);
  }

  public static security(message?: unknown, ...args: unknown[]): void {
    if (Logger.isTest) return;
    console.warn(chalk.red('security') + ':', message, ...args);
  }

  public static log(message?: unknown, ...args: unknown[]): void {
    switch (Logger.level) {
      case LogLevel.Debug:
        Logger.debug(message, ...args);
        break;
      case LogLevel.Error:
        Logger.error(message, ...args);
        break;
      case LogLevel.Info:
        Logger.info(message, ...args);
        break;
      case LogLevel.Warn:
        Logger.warn(message, ...args);
        break;
      default:
        console.log(chalk.gray('log') + ':', message, ...args);
    }
  }
}
