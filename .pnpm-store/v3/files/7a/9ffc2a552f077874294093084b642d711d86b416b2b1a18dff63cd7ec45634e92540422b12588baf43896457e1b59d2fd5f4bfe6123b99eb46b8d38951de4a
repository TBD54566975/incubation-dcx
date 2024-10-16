import { rmdir } from 'fs';
import { RECURSIVE_RMDIR_NODE_VERSION_SUPPORT } from '../constants/index.js';
import { WindowsStrategy } from './windows-strategy.abstract.js';
export class WindowsNode12Strategy extends WindowsStrategy {
    remove(path, callback) {
        if (this.isSupported()) {
            rmdir(path, { recursive: true }, callback);
            return true;
        }
        return this.checkNext(path, callback);
    }
    isSupported() {
        return (this.major > RECURSIVE_RMDIR_NODE_VERSION_SUPPORT.major ||
            (this.major === RECURSIVE_RMDIR_NODE_VERSION_SUPPORT.major &&
                this.minor > RECURSIVE_RMDIR_NODE_VERSION_SUPPORT.minor));
    }
}
