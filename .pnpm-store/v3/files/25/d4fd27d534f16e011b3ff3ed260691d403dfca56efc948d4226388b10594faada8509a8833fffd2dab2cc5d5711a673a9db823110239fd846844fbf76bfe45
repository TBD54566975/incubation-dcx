import { DEFAULT_CONFIG, MIN_CLI_COLUMNS_SIZE, UI_POSITIONS, } from './constants/index.js';
import { ERROR_MSG, INFO_MSGS } from './constants/messages.constants.js';
import { from } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap, } from 'rxjs/operators';
import { COLORS } from './constants/cli.constants.js';
import { FOLDER_SORT } from './constants/sort.result.js';
import { StatusUi, StatsUi, ResultsUi, LogsUi, HelpUi, HeaderUi, GeneralUi, WarningUi, } from './ui/index.js';
import _dirname from './dirname.js';
import colors from 'colors';
import { homedir } from 'os';
import path from 'path';
import openExplorer from 'open-file-explorer';
export class Controller {
    logger;
    searchStatus;
    fileService;
    spinnerService;
    consoleService;
    updateService;
    resultsService;
    uiService;
    folderRoot = '';
    stdout = process.stdout;
    config = DEFAULT_CONFIG;
    searchStart;
    searchDuration;
    uiHeader;
    uiGeneral;
    uiStats;
    uiStatus;
    uiResults;
    uiLogs;
    uiWarning;
    activeComponent = null;
    constructor(logger, searchStatus, fileService, spinnerService, consoleService, updateService, resultsService, uiService) {
        this.logger = logger;
        this.searchStatus = searchStatus;
        this.fileService = fileService;
        this.spinnerService = spinnerService;
        this.consoleService = consoleService;
        this.updateService = updateService;
        this.resultsService = resultsService;
        this.uiService = uiService;
    }
    init() {
        this.logger.info(process.argv.join(' '));
        this.logger.info(`Npkill started! v${this.getVersion()}`);
        this.initUi();
        if (this.consoleService.isRunningBuild()) {
            this.uiHeader.programVersion = this.getVersion();
        }
        this.consoleService.startListenKeyEvents();
        this.parseArguments();
        this.checkRequirements();
        this.prepareScreen();
        this.setupEventsListener();
        if (this.config.checkUpdates) {
            this.checkVersion();
        }
        if (this.config.deleteAll && !this.config.yes) {
            this.showDeleteAllWarning();
            this.uiWarning.confirm$
                .pipe(tap(() => {
                this.activeComponent = this.uiResults;
                this.uiWarning.setDeleteAllWarningVisibility(false);
                this.uiService.renderAll();
                this.scan();
            }))
                .subscribe();
            return;
        }
        this.scan();
    }
    showDeleteAllWarning() {
        this.uiWarning.setDeleteAllWarningVisibility(true);
        this.activeComponent = this.uiWarning;
    }
    initUi() {
        this.uiHeader = new HeaderUi();
        this.uiService.add(this.uiHeader);
        this.uiResults = new ResultsUi(this.resultsService, this.consoleService, this.fileService);
        this.uiService.add(this.uiResults);
        this.uiStats = new StatsUi(this.config, this.resultsService, this.logger);
        this.uiService.add(this.uiStats);
        this.uiStatus = new StatusUi(this.spinnerService, this.searchStatus);
        this.uiService.add(this.uiStatus);
        this.uiGeneral = new GeneralUi();
        this.uiService.add(this.uiGeneral);
        this.uiLogs = new LogsUi(this.logger);
        this.uiService.add(this.uiLogs);
        this.uiWarning = new WarningUi();
        this.uiService.add(this.uiWarning);
        // Set Events
        this.uiResults.delete$.subscribe((folder) => this.deleteFolder(folder));
        this.uiResults.showErrors$.subscribe(() => this.showErrorPopup(true));
        this.uiLogs.close$.subscribe(() => this.showErrorPopup(false));
        this.uiResults.openFolder$.subscribe((path) => openExplorer(path));
        // Activate the main interactive component
        this.activeComponent = this.uiResults;
    }
    parseArguments() {
        const options = this.consoleService.getParameters(process.argv);
        if (options.isTrue('help')) {
            this.showHelp();
            process.exit();
        }
        if (options.isTrue('version')) {
            this.showProgramVersion();
            process.exit();
        }
        if (options.isTrue('delete-all')) {
            this.config.deleteAll = true;
        }
        if (options.isTrue('sort-by')) {
            if (!this.isValidSortParam(options.getString('sort-by'))) {
                this.invalidSortParam();
            }
            this.config.sortBy = options.getString('sort-by');
        }
        const exclude = options.getString('exclude');
        if (exclude !== undefined && exclude !== '') {
            console.log('EXCLUDE', exclude);
            const userExcludeList = this.consoleService
                .splitData(this.consoleService.replaceString(exclude, '"', ''), ',')
                .map((path) => path.trim())
                .filter(Boolean)
                .map(path.normalize);
            // Add custom filters to the default exclude list.
            this.config.exclude = [...this.config.exclude, ...userExcludeList];
        }
        this.folderRoot = options.isTrue('directory')
            ? options.getString('directory')
            : process.cwd();
        if (options.isTrue('full-scan')) {
            this.folderRoot = homedir();
        }
        if (options.isTrue('hide-errors')) {
            this.config.showErrors = false;
        }
        if (options.isTrue('gb')) {
            this.config.folderSizeInGB = true;
        }
        if (options.isTrue('no-check-updates')) {
            this.config.checkUpdates = false;
        }
        if (options.isTrue('target-folder')) {
            this.config.targetFolder = options.getString('target-folder');
        }
        if (options.isTrue('bg-color')) {
            this.setColor(options.getString('bg-color'));
        }
        if (options.isTrue('exclude-hidden-directories')) {
            this.config.excludeHiddenDirectories = true;
        }
        if (options.isTrue('dry-run')) {
            this.config.dryRun = true;
            this.uiHeader.isDryRun = true;
        }
        if (options.isTrue('yes')) {
            this.config.yes = true;
        }
        // Remove trailing slash from folderRoot for consistency
        this.folderRoot = this.folderRoot.replace(/[/\\]$/, '');
    }
    showErrorPopup(visible) {
        this.uiLogs.setVisible(visible);
        // Need convert to pattern and have a stack for recover latest
        // component.
        this.uiResults.freezed = visible;
        this.uiStats.freezed = visible;
        this.uiStatus.freezed = visible;
        if (visible) {
            this.activeComponent = this.uiLogs;
            this.uiLogs.render();
        }
        else {
            this.activeComponent = this.uiResults;
            this.uiService.renderAll();
        }
    }
    invalidSortParam() {
        this.uiService.print(INFO_MSGS.NO_VALID_SORT_NAME);
        this.logger.error(INFO_MSGS.NO_VALID_SORT_NAME);
        this.exitWithError();
    }
    showHelp() {
        new HelpUi(this.consoleService).show();
    }
    showProgramVersion() {
        this.uiService.print('v' + this.getVersion());
    }
    setColor(color) {
        if (this.isValidColor(color)) {
            this.config.backgroundColor = COLORS[color];
        }
    }
    isValidColor(color) {
        return Object.keys(COLORS).some((validColor) => validColor === color);
    }
    isValidSortParam(sortName) {
        return Object.keys(FOLDER_SORT).includes(sortName);
    }
    getVersion() {
        const packageJson = _dirname + '/../package.json';
        const packageData = JSON.parse(this.fileService.getFileContent(packageJson));
        return packageData.version;
    }
    prepareScreen() {
        this.uiService.setRawMode();
        // this.uiService.prepareUi();
        this.uiService.setCursorVisible(false);
        this.uiService.clear();
        this.uiService.renderAll();
    }
    checkRequirements() {
        this.checkScreenRequirements();
        this.checkFileRequirements();
    }
    checkScreenRequirements() {
        if (this.isTerminalTooSmall()) {
            this.uiService.print(INFO_MSGS.MIN_CLI_CLOMUNS);
            this.logger.error(INFO_MSGS.MIN_CLI_CLOMUNS);
            this.exitWithError();
        }
        if (!this.stdout.isTTY) {
            this.uiService.print(INFO_MSGS.NO_TTY);
            this.logger.error(INFO_MSGS.NO_TTY);
            this.exitWithError();
        }
    }
    checkFileRequirements() {
        try {
            this.fileService.isValidRootFolder(this.folderRoot);
        }
        catch (error) {
            this.uiService.print(error.message);
            this.logger.error(error.message);
            this.exitWithError();
        }
    }
    checkVersion() {
        this.logger.info('Checking updates...');
        this.updateService
            .isUpdated(this.getVersion())
            .then((isUpdated) => {
            if (!isUpdated) {
                this.showUpdateMessage();
                this.logger.info('New version found!');
            }
            else {
                this.logger.info('Npkill is update');
            }
        })
            .catch((err) => {
            const errorMessage = ERROR_MSG.CANT_GET_REMOTE_VERSION + ': ' + err.message;
            this.newError(errorMessage);
        });
    }
    showUpdateMessage() {
        const message = colors.magenta(INFO_MSGS.NEW_UPDATE_FOUND);
        this.uiService.printAt(message, UI_POSITIONS.NEW_UPDATE_FOUND);
    }
    isTerminalTooSmall() {
        return this.stdout.columns <= MIN_CLI_COLUMNS_SIZE;
    }
    printFoldersSection() {
        this.uiResults.render();
    }
    setupEventsListener() {
        // Q: What is the type of the key?
        // Write the type of key
        this.uiService.stdin.on('keypress', (_, key) => {
            if (key['name'] !== '') {
                this.keyPress(key);
            }
            else {
                throw new Error('Invalid key: ' + JSON.stringify(key));
            }
        });
        this.stdout.on('resize', () => {
            this.uiService.clear();
            this.uiService.renderAll();
        });
        process.on('uncaughtException', (error) => {
            this.newError(error.message);
        });
        process.on('unhandledRejection', (error) => {
            this.newError(error.stack ?? error.message);
        });
    }
    keyPress(key) {
        const { name, ctrl } = key;
        if (this.isQuitKey(ctrl, name)) {
            this.quit();
        }
        if (this.activeComponent === null) {
            this.logger.error('activeComponent is NULL in Controller.');
            return;
        }
        this.activeComponent.onKeyInput(key);
    }
    scan() {
        this.uiStatus.start();
        const params = this.prepareListDirParams();
        const isExcludedDangerousDirectory = (path) => this.config.excludeHiddenDirectories &&
            this.fileService.isDangerous(path);
        this.searchStart = Date.now();
        const folders$ = this.fileService.listDir(params);
        this.logger.info(`Scan started in ${params.path}`);
        const newResults$ = folders$.pipe(catchError((error, caught) => {
            this.newError(error.message);
            return caught;
        }), mergeMap((dataFolder) => from(this.consoleService.splitData(dataFolder))), filter((path) => path !== ''));
        const excludedResults$ = newResults$.pipe(filter((path) => isExcludedDangerousDirectory(path)));
        const nonExcludedResults$ = newResults$.pipe(filter((path) => !isExcludedDangerousDirectory(path)));
        excludedResults$.subscribe(() => {
            // this.searchState.resultsFound++;
            // this.searchState.completedStatsCalculation++;
        });
        nonExcludedResults$
            .pipe(map((path) => ({
            path,
            size: 0,
            modificationTime: -1,
            isDangerous: this.fileService.isDangerous(path),
            status: 'live',
        })), tap((nodeFolder) => {
            this.searchStatus.newResult();
            this.resultsService.addResult(nodeFolder);
            this.logger.info(`Folder found: ${nodeFolder.path}`);
            if (this.config.sortBy === 'path') {
                this.resultsService.sortResults(this.config.sortBy);
                this.uiResults.clear();
            }
            this.printFoldersSection();
        }), mergeMap((nodeFolder) => {
            return this.calculateFolderStats(nodeFolder);
        }, 2), tap(() => this.searchStatus.completeStatCalculation()), tap((folder) => {
            if (this.config.deleteAll) {
                this.deleteFolder(folder);
            }
        }))
            .subscribe({
            next: () => this.printFoldersSection(),
            error: (error) => this.newError(error),
            complete: () => this.completeSearch(),
        });
    }
    prepareListDirParams() {
        const target = this.config.targetFolder;
        const params = {
            path: this.folderRoot,
            target,
        };
        if (this.config.exclude.length > 0) {
            params['exclude'] = this.config.exclude;
        }
        return params;
    }
    calculateFolderStats(nodeFolder) {
        this.logger.info(`Calculating stats for ${nodeFolder.path}`);
        return this.fileService.getFolderSize(nodeFolder.path).pipe(tap((size) => {
            nodeFolder.size = this.fileService.convertKbToGB(+size);
            this.logger.info(`Size of ${nodeFolder.path}: ${size}kb`);
        }), switchMap(async () => {
            // Saves resources by not scanning a result that is probably not of interest
            if (nodeFolder.isDangerous) {
                nodeFolder.modificationTime = -1;
                return nodeFolder;
            }
            const parentFolder = path.join(nodeFolder.path, '../');
            const result = await this.fileService.getRecentModificationInDir(parentFolder);
            nodeFolder.modificationTime = result;
            this.logger.info(`Last mod. of ${nodeFolder.path}: ${result}`);
            return nodeFolder;
        }), tap(() => {
            this.finishFolderStats();
        }));
    }
    finishFolderStats() {
        const needSort = this.config.sortBy === 'size' || this.config.sortBy === 'last-mod';
        if (needSort) {
            this.resultsService.sortResults(this.config.sortBy);
            this.uiResults.clear();
        }
        this.uiStats.render();
        this.printFoldersSection();
    }
    completeSearch() {
        this.setSearchDuration();
        this.uiResults.completeSearch();
        this.uiStatus.completeSearch(this.searchDuration);
        this.logger.info(`Search completed after ${this.searchDuration}s`);
    }
    setSearchDuration() {
        this.searchDuration = +((Date.now() - this.searchStart) / 1000).toFixed(2);
    }
    isQuitKey(ctrl, name) {
        return (ctrl && name === 'c') || name === 'q';
    }
    exitWithError() {
        this.uiService.print('\n');
        this.uiService.setRawMode(false);
        this.uiService.setCursorVisible(true);
        const logPath = this.logger.getSuggestLogFilePath();
        this.logger.saveToFile(logPath);
        process.exit(1);
    }
    quit() {
        this.uiService.setRawMode(false);
        this.uiService.clear();
        this.uiService.setCursorVisible(true);
        this.printExitMessage();
        this.logger.info('Thank for using npkill. Bye!');
        const logPath = this.logger.getSuggestLogFilePath();
        this.logger.saveToFile(logPath);
        process.exit();
    }
    printExitMessage() {
        const { spaceReleased } = this.resultsService.getStats();
        new GeneralUi().printExitMessage({ spaceReleased });
    }
    deleteFolder(folder) {
        if (folder.status === 'deleted' || folder.status === 'deleting') {
            return;
        }
        const isSafeToDelete = this.fileService.isSafeToDelete(folder.path, this.config.targetFolder);
        if (!isSafeToDelete) {
            this.newError(`Folder not safe to delete: ${folder.path}`);
            return;
        }
        this.logger.info(`Deleting ${folder.path}`);
        folder.status = 'deleting';
        this.searchStatus.pendingDeletions++;
        this.uiStatus.render();
        this.printFoldersSection();
        const deleteFunction = this.config
            .dryRun
            ? this.fileService.fakeDeleteDir.bind(this.fileService)
            : this.fileService.deleteDir.bind(this.fileService);
        deleteFunction(folder.path)
            .then(() => {
            folder.status = 'deleted';
            this.searchStatus.pendingDeletions--;
            this.uiStats.render();
            this.uiStatus.render();
            this.printFoldersSection();
            this.logger.info(`Deleted ${folder.path}`);
        })
            .catch((e) => {
            folder.status = 'error-deleting';
            this.searchStatus.pendingDeletions--;
            this.uiStatus.render();
            this.printFoldersSection();
            this.newError(e.message);
        });
    }
    newError(error) {
        this.logger.error(error);
        this.uiStats.render();
    }
}
