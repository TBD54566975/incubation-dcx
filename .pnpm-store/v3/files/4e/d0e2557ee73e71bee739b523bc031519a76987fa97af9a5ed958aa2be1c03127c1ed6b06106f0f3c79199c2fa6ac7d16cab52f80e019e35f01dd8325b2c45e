import type { StorageController } from '../store/storage-controller.js';
import type { ResumableTaskStore } from '../types/resumable-task-store.js';
export declare enum ResumableTaskName {
    RecordsDelete = "RecordsDelete"
}
export type ResumableTask = {
    name: ResumableTaskName;
    data: any;
};
export declare class ResumableTaskManager {
    private resumableTaskStore;
    /**
     * The frequency at which the automatic timeout extension is requested for a resumable task.
     */
    static readonly timeoutExtensionFrequencyInSeconds = 30;
    private resumableTaskBatchSize;
    private resumableTaskHandlers;
    constructor(resumableTaskStore: ResumableTaskStore, storageController: StorageController);
    /**
     * Runs a new resumable task.
     */
    run(task: ResumableTask): Promise<void>;
    /**
     * Runs a resumable task with automatic timeout extension.
     * Deletes the task from the resumable task store once it is completed.
     */
    private runWithAutomaticTimeoutExtension;
    /**
     * Removes the specified timeout extension loop timer.
     * NOTE: created mainly for testing purposes so we can spy on this specific method without needing to filter out other `clearInterval` calls.
     * NOTE: using `ReturnType` utility type to avoid using node.js specific type, because `setInterval` returns a `number` in browser environments.
     */
    static clearTimeoutExtensionTimer(timer: ReturnType<typeof setInterval>): void;
    /**
     * Resumes the execution of resumable tasks until all are completed successfully.
     */
    resumeTasksAndWaitForCompletion(): Promise<void>;
    /**
     * Repeatedly retry the given tasks until all are completed successfully.
     */
    private retryTasksUntilCompletion;
}
//# sourceMappingURL=resumable-task-manager.d.ts.map