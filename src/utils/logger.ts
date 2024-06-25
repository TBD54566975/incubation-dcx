import chalk from 'chalk';

enum Env {
    Development = 'development',
    Production = 'production'
}

enum LogLevel {
    Debug = 'debug',
    Error = 'error',
    Info = 'info',
    Log = 'log',
    Warn = 'warn'
}

/**
 * 
 * A simple console logger with colorized output.
 */
export default class Logger implements Partial<Console> {
    public static level: 'debug' | 'error' | 'info' | 'log' | 'warn' = process.env.NODE_ENV === Env.Production ? 'error' : 'debug';

    public static debug(message?: unknown, ...args: unknown[]): void {
        console.debug(chalk.green("debug") + ":", message, ...args);
    }

    public static error(message?: unknown, ...args: unknown[]): void {
        console.error(chalk.red("error") + ":", message, ...args);
    }

    public static info(message?: unknown, ...args: unknown[]): void {
        console.info(chalk.blue("info") + ":", message, ...args);
    }

    public static warn(message?: unknown, ...args: unknown[]): void {
        console.warn(chalk.yellow("warn") + ":", message, ...args);
    }

    public static security(message?: unknown, ...args: unknown[]): void {
        console.warn(chalk.red("security") + ":", message, ...args);

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
                console.log(chalk.gray("log") + ":", message, ...args);
        }
    }
}