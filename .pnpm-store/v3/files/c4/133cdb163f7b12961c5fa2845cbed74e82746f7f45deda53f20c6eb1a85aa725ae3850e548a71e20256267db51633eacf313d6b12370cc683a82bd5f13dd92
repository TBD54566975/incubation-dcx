import getFolderSize from 'get-folder-size';
import { Subject, Observable } from 'rxjs';
import { FileService } from './files.service.js';
import { WindowsStrategyManager } from '../../strategies/windows-remove-dir.strategy.js';
export class WindowsFilesService extends FileService {
    streamService;
    fileWorkerService;
    windowsStrategyManager = new WindowsStrategyManager();
    constructor(streamService, fileWorkerService) {
        super();
        this.streamService = streamService;
        this.fileWorkerService = fileWorkerService;
    }
    getFolderSize(path) {
        return new Observable((observer) => {
            getFolderSize.loose(path).then((size) => {
                observer.next(super.convertBytesToKB(size));
                observer.complete();
            });
        });
    }
    listDir(params) {
        const stream$ = new Subject();
        this.fileWorkerService.startScan(stream$, params);
        return stream$;
    }
    async deleteDir(path) {
        return this.windowsStrategyManager.deleteDir(path);
    }
}
