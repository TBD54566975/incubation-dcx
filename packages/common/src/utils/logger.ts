/* eslint-disable no-undef */
import chalk from 'chalk';
import { config as dcxConfig } from '../config.js';

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
  public static isTest: boolean = dcxConfig.DCX_ENV === Env.Test;
  public static isDevelopment: boolean = dcxConfig.DCX_ENV === Env.Development;
  public static isProduction: boolean = dcxConfig.DCX_ENV === Env.Production;

  public static level: Level = dcxConfig.DCX_ENV as Level;
  constructor() {
    if(Logger.isTest){
      Logger.level = 'test';
    } else if (Logger.isDevelopment) {
      Logger.level = 'debug';
    } else {
      Logger.level = 'info';
    }
  }

  public static debug(message?: unknown, ...args: unknown[]): void {
    if(Logger.level === Env.Test) return;
    console.debug(chalk.green('debug') + ':', message, ...args);
  }

  public static error(message?: unknown, ...args: unknown[]): void {
    if(Logger.level === Env.Test) return;
    console.error(chalk.red('error') + ':', message, ...args);
  }

  public static info(message?: unknown, ...args: unknown[]): void {
    if(Logger.level === Env.Test) return;
    console.info(chalk.blue('info') + ':', message, ...args);
  }

  public static warn(message?: unknown, ...args: unknown[]): void {
    if(Logger.level === Env.Test) return;
    console.warn(chalk.yellow('warn') + ':', message, ...args);
  }

  public static security(message?: unknown, ...args: unknown[]): void {
    if(Logger.level === Env.Test) return;
    console.warn(chalk.red('security') + ':', message, ...args);
  }

  public static log(message?: unknown, ...args: unknown[]): void {
    switch (Logger.level) {
      case LogLevel.Log:
        console.log(chalk.gray('log') + ':', message, ...args);
        break;
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
        break;
    }
  }
}
