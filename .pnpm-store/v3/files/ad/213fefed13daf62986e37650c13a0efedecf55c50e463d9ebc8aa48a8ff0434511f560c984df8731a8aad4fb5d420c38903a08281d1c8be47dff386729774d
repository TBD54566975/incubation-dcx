import { WindowsNode12Strategy, WindowsNode14Strategy, WindowsDefaultStrategy, } from './index.js';
export class WindowsStrategyManager {
    async deleteDir(path) {
        const windowsStrategy = new WindowsNode14Strategy();
        windowsStrategy
            .setNextStrategy(new WindowsNode12Strategy())
            .setNextStrategy(new WindowsDefaultStrategy());
        return new Promise((resolve, reject) => {
            windowsStrategy.remove(path, (err) => {
                if (err !== null) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }
}
