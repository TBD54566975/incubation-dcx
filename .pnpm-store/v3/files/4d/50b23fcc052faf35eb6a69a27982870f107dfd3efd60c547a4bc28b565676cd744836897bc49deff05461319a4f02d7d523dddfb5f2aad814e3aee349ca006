import ansiEscapes from 'ansi-escapes';
import { HELP_HEADER, OPTIONS, HELP_FOOTER, HELP_PROGRESSBAR, } from '../../constants/cli.constants.js';
import { MARGINS, UI_HELP } from '../../constants/main.constants.js';
import { INFO_MSGS } from '../../constants/messages.constants.js';
import { BaseUi } from '../base.ui.js';
import colors from 'colors';
export class HelpUi extends BaseUi {
    consoleService;
    constructor(consoleService) {
        super();
        this.consoleService = consoleService;
    }
    render() {
        throw new Error('Method not implemented.');
    }
    show() {
        this.clear();
        this.print(colors.inverse(INFO_MSGS.HELP_TITLE + '\n\n'));
        this.print(HELP_HEADER + '\n\n');
        this.print(HELP_PROGRESSBAR + '\n\n');
        let lineCount = 0;
        OPTIONS.forEach((option, index) => {
            this.printAtHelp(option.arg.reduce((text, arg) => text + ', ' + arg), {
                x: UI_HELP.X_COMMAND_OFFSET,
                y: index + UI_HELP.Y_OFFSET + lineCount,
            });
            const description = this.consoleService.splitWordsByWidth(option.description, this.terminal.columns - UI_HELP.X_DESCRIPTION_OFFSET);
            description.forEach((line) => {
                this.printAtHelp(line, {
                    x: UI_HELP.X_DESCRIPTION_OFFSET,
                    y: index + UI_HELP.Y_OFFSET + lineCount,
                });
                ++lineCount;
            });
        });
        this.print(HELP_FOOTER + '\n');
    }
    clear() {
        for (let row = MARGINS.ROW_RESULTS_START; row < this.terminal.rows; row++) {
            this.clearLine(row);
        }
    }
    printAtHelp(message, position) {
        this.setCursorAtHelp(position);
        this.print(message);
        if (!/-[a-zA-Z]/.test(message.substring(0, 2)) && message !== '') {
            this.print('\n\n');
        }
    }
    setCursorAtHelp({ x }) {
        this.print(ansiEscapes.cursorTo(x));
    }
}
