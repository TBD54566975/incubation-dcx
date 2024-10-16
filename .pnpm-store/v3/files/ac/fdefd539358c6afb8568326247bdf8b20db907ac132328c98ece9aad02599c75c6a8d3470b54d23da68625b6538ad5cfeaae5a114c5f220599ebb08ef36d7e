import { tmpdir } from 'os';
import { existsSync, renameSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
const LATEST_TAG = 'latest';
const OLD_TAG = 'old';
export class LoggerService {
    log = [];
    info(message) {
        this.addToLog({
            type: 'info',
            timestamp: this.getTimestamp(),
            message,
        });
    }
    error(message) {
        this.addToLog({
            type: 'error',
            timestamp: this.getTimestamp(),
            message,
        });
    }
    get(type = 'all') {
        if (type === 'all') {
            return this.log;
        }
        return this.log.filter((entry) => entry.type === type);
    }
    saveToFile(path) {
        const convertTime = (timestamp) => timestamp;
        const content = this.log.reduce((log, actual) => {
            const line = `[${convertTime(actual.timestamp)}](${actual.type}) ${actual.message}\n`;
            return log + line;
        }, '');
        this.rotateLogFile(path);
        writeFileSync(path, content);
    }
    getSuggestLogFilePath() {
        const filename = `npkill-${LATEST_TAG}.log`;
        return join(tmpdir(), filename);
    }
    rotateLogFile(newLogPath) {
        if (!existsSync(newLogPath)) {
            return; // Rotation is not necessary
        }
        const basePath = dirname(newLogPath);
        const logName = basename(newLogPath);
        const oldLogName = logName.replace(LATEST_TAG, OLD_TAG);
        const oldLogPath = join(basePath, oldLogName);
        renameSync(newLogPath, oldLogPath);
    }
    addToLog(entry) {
        this.log = [...this.log, entry];
    }
    getTimestamp() {
        return new Date().getTime();
    }
}
