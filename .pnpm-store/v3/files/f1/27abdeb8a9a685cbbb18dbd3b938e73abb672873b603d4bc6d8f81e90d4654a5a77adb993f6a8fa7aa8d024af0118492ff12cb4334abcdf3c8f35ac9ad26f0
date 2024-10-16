export class SearchStatus {
    pendingSearchTasks = 0;
    completedSearchTasks = 0;
    pendingStatsCalculation = 0;
    completedStatsCalculation = 0;
    resultsFound = 0;
    pendingDeletions = 0;
    workerStatus = 'stopped';
    workersJobs;
    newResult() {
        this.resultsFound++;
        this.pendingStatsCalculation++;
    }
    completeStatCalculation() {
        this.pendingStatsCalculation--;
        this.completedStatsCalculation++;
    }
}
