import { version } from 'process';
export class WindowsStrategy {
    next;
    major;
    minor;
    constructor() {
        const { major, minor } = this.getNodeVersion();
        this.major = major;
        this.minor = minor;
    }
    setNextStrategy(next) {
        this.next = next;
        return next;
    }
    checkNext(path, callback) {
        if (this.next === undefined) {
            return true;
        }
        return this.next.remove(path, callback);
    }
    getNodeVersion() {
        const releaseVersionsRegExp = /^v(\d{1,2})\.(\d{1,2})\.(\d{1,2})/;
        const versionMatch = version.match(releaseVersionsRegExp);
        if (versionMatch === null) {
            throw new Error(`Unable to parse Node version: ${version}`);
        }
        return {
            major: parseInt(versionMatch[1], 10),
            minor: parseInt(versionMatch[2], 10),
            patch: parseInt(versionMatch[3], 10),
        };
    }
}
