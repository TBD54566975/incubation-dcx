import { rm } from 'fs';
import { RM_NODE_VERSION_SUPPORT } from '../constants/recursive-rmdir-node-support.constants.js';
import { WindowsStrategy } from './windows-strategy.abstract.js';
export class WindowsNode14Strategy extends WindowsStrategy {
    remove(path, callback) {
        if (this.isSupported()) {
            rm(path, { recursive: true }, callback);
            return true;
        }
        return this.checkNext(path, callback);
    }
    isSupported() {
        return (this.major > RM_NODE_VERSION_SUPPORT.major ||
            (this.major === RM_NODE_VERSION_SUPPORT.major &&
                this.minor > RM_NODE_VERSION_SUPPORT.minor));
    }
}
