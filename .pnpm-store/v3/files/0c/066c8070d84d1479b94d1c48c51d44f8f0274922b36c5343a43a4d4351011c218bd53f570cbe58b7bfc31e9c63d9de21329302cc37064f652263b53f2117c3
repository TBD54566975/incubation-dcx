import { opendir } from 'fs/promises';
import EventEmitter from 'events';
import { join } from 'path';
import { parentPort } from 'node:worker_threads';
import { EVENTS, MAX_PROCS } from '../../constants/workers.constants.js';
var ETaskOperation;
(function (ETaskOperation) {
    ETaskOperation[ETaskOperation["explore"] = 0] = "explore";
    ETaskOperation[ETaskOperation["getSize"] = 1] = "getSize";
})(ETaskOperation || (ETaskOperation = {}));
(() => {
    let id = 0;
    let fileWalker;
    let tunnel;
    if (parentPort === null) {
        throw new Error('Worker must be spawned from a parent thread.');
    }
    parentPort.on('message', (message) => {
        if (message?.type === EVENTS.startup) {
            id = message.value.id;
            tunnel = message.value.channel;
            fileWalker = new FileWalker();
            initTunnelListeners();
            initFileWalkerListeners();
            notifyWorkerReady();
        }
    });
    function notifyWorkerReady() {
        tunnel.postMessage({
            type: EVENTS.alive,
            value: null,
        });
    }
    function initTunnelListeners() {
        tunnel.on('message', (message) => {
            if (message?.type === EVENTS.exploreConfig) {
                fileWalker.setSearchConfig(message.value);
            }
            if (message?.type === EVENTS.explore) {
                fileWalker.enqueueTask(message.value.path);
            }
        });
    }
    function initFileWalkerListeners() {
        fileWalker.events.on('newResult', ({ results }) => {
            tunnel.postMessage({
                type: EVENTS.scanResult,
                value: { results, workerId: id, pending: fileWalker.pendingJobs },
            });
        });
    }
})();
class FileWalker {
    events = new EventEmitter();
    searchConfig = {
        path: '',
        target: '',
        exclude: [],
    };
    taskQueue = [];
    completedTasks = 0;
    procs = 0;
    setSearchConfig(params) {
        this.searchConfig = params;
    }
    enqueueTask(path) {
        this.taskQueue.push({ path, operation: ETaskOperation.explore });
        this.processQueue();
    }
    async run(path) {
        this.updateProcs(1);
        try {
            const dir = await opendir(path);
            await this.analizeDir(path, dir);
        }
        catch (_) {
            this.completeTask();
        }
    }
    async analizeDir(path, dir) {
        const results = [];
        let entry = null;
        while ((entry = await dir.read().catch(() => null)) != null) {
            this.newDirEntry(path, entry, results);
        }
        this.events.emit('newResult', { results });
        await dir.close();
        this.completeTask();
        if (this.taskQueue.length === 0 && this.procs === 0) {
            this.completeAll();
        }
    }
    newDirEntry(path, entry, results) {
        const subpath = join(path, entry.name);
        const shouldSkip = !entry.isDirectory() || this.isExcluded(subpath);
        if (shouldSkip) {
            return;
        }
        results.push({
            path: subpath,
            isTarget: this.isTargetFolder(entry.name),
        });
    }
    isExcluded(path) {
        if (this.searchConfig.exclude === undefined) {
            return false;
        }
        for (let i = 0; i < this.searchConfig.exclude.length; i++) {
            const excludeString = this.searchConfig.exclude[i];
            if (path.includes(excludeString)) {
                return true;
            }
        }
        return false;
    }
    isTargetFolder(path) {
        // return basename(path) === this.searchConfig.target;
        return path === this.searchConfig.target;
    }
    completeTask() {
        this.updateProcs(-1);
        this.processQueue();
        this.completedTasks++;
    }
    updateProcs(value) {
        this.procs += value;
    }
    processQueue() {
        while (this.procs < MAX_PROCS && this.taskQueue.length > 0) {
            const path = this.taskQueue.shift()?.path;
            if (path === undefined || path === '') {
                return;
            }
            // Ignore as other mechanisms (pending/completed tasks) are used to
            // check the progress of this.
            this.run(path).then(() => { }, () => { });
        }
    }
    completeAll() {
        // Any future action.
    }
    /*  get stats(): WorkerStats {
      return {
        pendingSearchTasks: this.taskQueue.length,
        completedSearchTasks: this.completedTasks,
        procs: this.procs,
      };
    } */
    get pendingJobs() {
        return this.taskQueue.length;
    }
}
