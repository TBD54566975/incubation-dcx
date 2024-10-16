import { exec } from 'child_process';
import { FileService } from './files.service.js';
import { Subject } from 'rxjs';
export class UnixFilesService extends FileService {
    streamService;
    fileWorkerService;
    constructor(streamService, fileWorkerService) {
        super();
        this.streamService = streamService;
        this.fileWorkerService = fileWorkerService;
    }
    listDir(params) {
        const stream$ = new Subject();
        this.fileWorkerService.startScan(stream$, params);
        return stream$;
    }
    async deleteDir(path) {
        return new Promise((resolve, reject) => {
            const command = `rm -rf "${path}"`;
            exec(command, (error, stdout, stderr) => {
                if (error !== null) {
                    reject(error);
                    return;
                }
                if (stderr !== '') {
                    reject(stderr);
                    return;
                }
                resolve(true);
            });
        });
    }
    prepareFindArgs(params) {
        const { path, target, exclude } = params;
        let args = [path];
        if (exclude !== undefined && exclude.length > 0) {
            args = [...args, this.prepareExcludeArgs(exclude)].flat();
        }
        args = [...args, '-name', target, '-prune'];
        return args;
    }
    prepareExcludeArgs(exclude) {
        const excludeDirs = exclude.map((dir) => [
            '-not',
            '(',
            '-name',
            dir,
            '-prune',
            ')',
        ]);
        return excludeDirs.flat();
    }
}
