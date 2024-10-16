import os from 'os';
import { dirname, extname } from 'path';
import { Worker, MessageChannel } from 'node:worker_threads';
import { MAX_WORKERS, EVENTS } from '../../constants/workers.constants.js';
export class FileWorkerService {
    logger;
    searchStatus;
    index = 0;
    workers = [];
    workersPendingJobs = [];
    pendingJobs = 0;
    totalJobs = 0;
    tunnels = [];
    constructor(logger, searchStatus) {
        this.logger = logger;
        this.searchStatus = searchStatus;
    }
    startScan(stream$, params) {
        this.instantiateWorkers(this.getOptimalNumberOfWorkers());
        this.listenEvents(stream$);
        this.setWorkerConfig(params);
        // Manually add the first job.
        this.addJob({ job: 'explore', value: { path: params.path } });
    }
    listenEvents(stream$) {
        this.tunnels.forEach((tunnel) => {
            tunnel.on('message', (data) => {
                this.newWorkerMessage(data, stream$);
            });
            this.workers.forEach((worker, index) => {
                worker.on('exit', () => {
                    this.logger.info(`Worker ${index} exited.`);
                });
                worker.on('error', (error) => {
                    // Respawn worker.
                    throw error;
                });
            });
        });
    }
    newWorkerMessage(message, stream$) {
        const { type, value } = message;
        if (type === EVENTS.scanResult) {
            const results = value.results;
            const workerId = value.workerId;
            this.workersPendingJobs[workerId] = value.pending;
            results.forEach((result) => {
                const { path, isTarget } = result;
                if (isTarget) {
                    stream$.next(path);
                }
                else {
                    this.addJob({
                        job: 'explore',
                        value: { path },
                    });
                }
            });
            this.pendingJobs = this.getPendingJobs();
            this.checkJobComplete(stream$);
        }
        if (type === EVENTS.alive) {
            this.searchStatus.workerStatus = 'scanning';
        }
    }
    /** Jobs are distributed following the round-robin algorithm. */
    addJob(job) {
        if (job.job === 'explore') {
            const tunnel = this.tunnels[this.index];
            const message = { type: EVENTS.explore, value: job.value };
            tunnel.postMessage(message);
            this.workersPendingJobs[this.index]++;
            this.totalJobs++;
            this.pendingJobs++;
            this.index = this.index >= this.workers.length - 1 ? 0 : this.index + 1;
        }
    }
    checkJobComplete(stream$) {
        this.updateStats();
        const isCompleted = this.getPendingJobs() === 0;
        if (isCompleted) {
            this.searchStatus.workerStatus = 'finished';
            stream$.complete();
            void this.killWorkers();
        }
    }
    instantiateWorkers(amount) {
        this.logger.info(`Instantiating ${amount} workers..`);
        for (let i = 0; i < amount; i++) {
            const { port1, port2 } = new MessageChannel();
            const worker = new Worker(this.getWorkerPath());
            this.tunnels.push(port1);
            worker.postMessage({ type: EVENTS.startup, value: { channel: port2, id: i } }, [port2]);
            this.workers.push(worker);
            this.logger.info(`Worker ${i} instantiated.`);
        }
    }
    setWorkerConfig(params) {
        this.tunnels.forEach((tunnel) => tunnel.postMessage({
            type: EVENTS.exploreConfig,
            value: params,
        }));
    }
    async killWorkers() {
        for (let i = 0; i < this.workers.length; i++) {
            this.workers[i].removeAllListeners();
            this.tunnels[i].removeAllListeners();
            await this.workers[i]
                .terminate()
                .catch((error) => this.logger.error(error));
        }
        this.workers = [];
        this.tunnels = [];
    }
    getPendingJobs() {
        return this.workersPendingJobs.reduce((acc, x) => x + acc, 0);
    }
    updateStats() {
        this.searchStatus.pendingSearchTasks = this.pendingJobs;
        this.searchStatus.completedSearchTasks = this.totalJobs;
        this.searchStatus.workersJobs = this.workersPendingJobs;
    }
    getWorkerPath() {
        const actualFilePath = import.meta.url;
        const dirPath = dirname(actualFilePath);
        // Extension = .ts if is not transpiled.
        // Extension = .js if is a build
        const extension = extname(actualFilePath);
        const workerName = 'files.worker';
        return new URL(`${dirPath}/${workerName}${extension}`);
    }
    getOptimalNumberOfWorkers() {
        const cores = os.cpus().length;
        // TODO calculate amount of RAM available and take it
        // as part on the ecuation.
        const numWorkers = cores > MAX_WORKERS ? MAX_WORKERS : cores - 1;
        return numWorkers < 1 ? 1 : numWorkers;
    }
}
