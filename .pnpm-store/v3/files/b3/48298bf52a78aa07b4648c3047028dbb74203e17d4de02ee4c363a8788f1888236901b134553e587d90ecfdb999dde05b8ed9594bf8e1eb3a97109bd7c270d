import { BaseUi } from '../base.ui.js';
import colors from 'colors';
import { Subject } from 'rxjs';
export class LogsUi extends BaseUi {
    logger;
    close$ = new Subject();
    size;
    errors = 0;
    pages = [];
    actualPage = 0;
    KEYS = {
        e: () => this.cyclePages(),
        escape: () => this.close(),
    };
    constructor(logger) {
        super();
        this.logger = logger;
        this.setVisible(false, false);
    }
    onKeyInput({ name }) {
        const action = this.KEYS[name];
        if (action === undefined) {
            return;
        }
        action();
    }
    render() {
        this.renderPopup();
    }
    cyclePages() {
        this.actualPage++;
        if (this.actualPage >= this.pages.length) {
            this.actualPage = 0;
            this.close();
            return;
        }
        this.render();
    }
    close() {
        this.close$.next(null);
    }
    renderPopup() {
        this.calculatePosition();
        for (let x = this.position.x; x < this.size.x; x++) {
            for (let y = this.position.y; y < this.size.y; y++) {
                let char = ' ';
                if (x === this.position.x || x === this.size.x - 1) {
                    char = '│';
                }
                if (y === this.position.y) {
                    char = '═';
                }
                if (y === this.size.y - 1) {
                    char = '─';
                }
                if (x === this.position.x && y === this.position.y) {
                    char = '╒';
                }
                if (x === this.size.x - 1 && y === this.position.y) {
                    char = '╕';
                }
                if (x === this.position.x && y === this.size.y - 1) {
                    char = '╰';
                }
                if (x === this.size.x - 1 && y === this.size.y - 1) {
                    char = '╯';
                }
                this.printAt(colors['bgBlack'](char), { x, y });
            }
        }
        const width = this.size.x - this.position.x - 2;
        const maxEntries = this.size.y - this.position.y - 2;
        const messagesByLine = this.logger
            .get('error')
            .map((entry, index) => `${index}. ${entry.message}`)
            .reduce((acc, line) => {
            acc = [...acc, ...this.chunkString(line, width)];
            return acc;
        }, []);
        this.pages = this.chunkArray(messagesByLine, maxEntries);
        this.errors = this.logger.get('error').length;
        if (messagesByLine.length === 0) {
            this.printAt(this.stylizeText('No errors!'), {
                x: this.position.x + 1,
                y: this.position.y + 1,
            });
        }
        this.pages[this.actualPage].forEach((entry, index) => {
            this.printAt(this.stylizeText(entry, 'error'), {
                x: this.position.x + 1,
                y: this.position.y + 1 + index,
            });
        });
        this.printHeader();
    }
    printHeader() {
        const titleText = ' Errors ';
        this.printAt(this.stylizeText(titleText), {
            x: Math.floor((this.size.x + titleText.length / 2) / 2) - this.position.x,
            y: this.position.y,
        });
        const rightText = ` ${this.errors} errors | Page ${this.actualPage + 1}/${this.pages.length} `;
        this.printAt(this.stylizeText(rightText), {
            x: Math.floor(this.size.x + this.position.x - 4 - (rightText.length + 2)),
            y: this.position.y,
        });
    }
    stylizeText(text, style = 'normal') {
        const styles = { normal: 'white', error: 'red' };
        const color = styles[style];
        return colors[color](colors['bgBlack'](text));
    }
    chunkString(str, length) {
        const matches = str.match(new RegExp(`.{1,${length}}`, 'g'));
        return matches !== null ? [...matches] : [];
    }
    chunkArray(arr, size) {
        return arr.length > size
            ? [arr.slice(0, size), ...this.chunkArray(arr.slice(size), size)]
            : [arr];
    }
    calculatePosition() {
        const posX = 5;
        const posY = 4;
        this.setPosition({ x: posX, y: posY }, false);
        this.size = {
            x: this.terminal.columns - posX,
            y: this.terminal.rows - 3,
        };
    }
}
