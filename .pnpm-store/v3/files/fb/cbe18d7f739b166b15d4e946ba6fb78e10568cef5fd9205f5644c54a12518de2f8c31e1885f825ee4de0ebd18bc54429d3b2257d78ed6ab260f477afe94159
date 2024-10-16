import type { ManagedResumableTask, ResumableTaskStore } from '../types/resumable-task-store.js';
import { createLevelDatabase, LevelWrapper } from './level-wrapper.js';
type ResumableTaskStoreLevelConfig = {
    location?: string;
    createLevelDatabase?: typeof createLevelDatabase;
};
/**
 * A simple single-instance implementation of {@link ResumableTaskStore} that works in both browsers and node.js.
 * Leverages LevelDB under the hood.
 */
export declare class ResumableTaskStoreLevel implements ResumableTaskStore {
    private static readonly taskTimeoutInSeconds;
    db: LevelWrapper<string>;
    config: ResumableTaskStoreLevelConfig;
    constructor(config: ResumableTaskStoreLevelConfig);
    open(): Promise<void>;
    close(): Promise<void>;
    register(task: any, timeoutInSeconds: number): Promise<ManagedResumableTask>;
    grab(count: number): Promise<ManagedResumableTask[]>;
    read(taskId: string): Promise<ManagedResumableTask | undefined>;
    extend(taskId: string, timeoutInSeconds: number): Promise<void>;
    delete(taskId: string): Promise<void>;
    /**
     * Deletes everything in the store. Mainly used in tests.
     */
    clear(): Promise<void>;
}
export {};
//# sourceMappingURL=resumable-task-store-level.d.ts.map