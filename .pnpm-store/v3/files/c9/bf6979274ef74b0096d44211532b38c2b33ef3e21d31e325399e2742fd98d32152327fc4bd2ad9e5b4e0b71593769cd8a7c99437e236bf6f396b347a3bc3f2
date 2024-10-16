var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var ResumableTaskName;
(function (ResumableTaskName) {
    ResumableTaskName["RecordsDelete"] = "RecordsDelete";
})(ResumableTaskName || (ResumableTaskName = {}));
export class ResumableTaskManager {
    constructor(resumableTaskStore, storageController) {
        this.resumableTaskStore = resumableTaskStore;
        this.resumableTaskBatchSize = 100;
        // assign resumable task handlers
        this.resumableTaskHandlers = {
            // NOTE: The arrow function is IMPORTANT here, else the `this` context will be lost within the invoked method.
            // e.g. code within performRecordsDelete() won't know `this` refers to the `storageController` instance.
            [ResumableTaskName.RecordsDelete]: (task) => __awaiter(this, void 0, void 0, function* () { return yield storageController.performRecordsDelete(task); }),
        };
    }
    /**
     * Runs a new resumable task.
     */
    run(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeoutInSeconds = ResumableTaskManager.timeoutExtensionFrequencyInSeconds * 2; // give ample time for extension to take place
            // register the new resumable task before running it so that it can be resumed if it times out for any reason
            const managedResumableTask = yield this.resumableTaskStore.register(task, timeoutInSeconds);
            yield this.runWithAutomaticTimeoutExtension(managedResumableTask);
        });
    }
    /**
     * Runs a resumable task with automatic timeout extension.
     * Deletes the task from the resumable task store once it is completed.
     */
    runWithAutomaticTimeoutExtension(managedTask) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeoutInSeconds = ResumableTaskManager.timeoutExtensionFrequencyInSeconds * 2; // give ample time for extension to take place
            let timer;
            try {
                // start a timer loop to keep extending the timeout of the task until it is completed
                timer = setInterval(() => {
                    this.resumableTaskStore.extend(managedTask.id, timeoutInSeconds);
                }, ResumableTaskManager.timeoutExtensionFrequencyInSeconds * 1000);
                const handler = this.resumableTaskHandlers[managedTask.task.name];
                yield handler(managedTask.task.data);
                yield this.resumableTaskStore.delete(managedTask.id);
            }
            finally {
                ResumableTaskManager.clearTimeoutExtensionTimer(timer);
            }
        });
    }
    /**
     * Removes the specified timeout extension loop timer.
     * NOTE: created mainly for testing purposes so we can spy on this specific method without needing to filter out other `clearInterval` calls.
     * NOTE: using `ReturnType` utility type to avoid using node.js specific type, because `setInterval` returns a `number` in browser environments.
     */
    static clearTimeoutExtensionTimer(timer) {
        clearInterval(timer);
    }
    /**
     * Resumes the execution of resumable tasks until all are completed successfully.
     */
    resumeTasksAndWaitForCompletion() {
        return __awaiter(this, void 0, void 0, function* () {
            while (true) {
                const resumableTasks = yield this.resumableTaskStore.grab(this.resumableTaskBatchSize);
                if (resumableTasks === undefined || resumableTasks.length === 0) {
                    break;
                }
                // Handle this batch of tasks before grabbing the next batch.
                yield this.retryTasksUntilCompletion(resumableTasks);
            }
        });
    }
    /**
     * Repeatedly retry the given tasks until all are completed successfully.
     */
    retryTasksUntilCompletion(resumableTasks) {
        return __awaiter(this, void 0, void 0, function* () {
            let managedTasks = resumableTasks;
            while (managedTasks.length > 0) {
                const managedTasksCopy = managedTasks;
                managedTasks = [];
                const allTaskPromises = managedTasksCopy.map((managedTask) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield this.runWithAutomaticTimeoutExtension(managedTask);
                    }
                    catch (error) {
                        console.error('Error while running resumable task:', error);
                        console.error('Resumable task:', resumableTasks);
                        managedTasks.push(managedTask);
                    }
                }));
                yield Promise.all(allTaskPromises);
            }
        });
    }
}
/**
 * The frequency at which the automatic timeout extension is requested for a resumable task.
 */
ResumableTaskManager.timeoutExtensionFrequencyInSeconds = 30;
//# sourceMappingURL=resumable-task-manager.js.map