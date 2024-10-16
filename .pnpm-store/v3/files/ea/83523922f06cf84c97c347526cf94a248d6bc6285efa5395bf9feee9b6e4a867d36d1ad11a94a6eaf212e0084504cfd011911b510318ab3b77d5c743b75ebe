import { BaseUi } from './base.ui.js';
/**
 * A UI that buffers the output and prints it all at once when calling the
 * flush() function.
 */
export class HeavyUi extends BaseUi {
    buffer = '';
    previousBuffer = '';
    /**
     * Stores the text in a buffer. No will print it to stdout until flush()
     * is called.
     */
    print(text) {
        this.buffer += text;
    }
    /** Prints the buffer (if have any change) to stdout and clears it. */
    flush() {
        if (this.freezed) {
            return;
        }
        if (this.buffer === this.previousBuffer) {
            this.clearBuffer();
            return;
        }
        process.stdout.write.bind(process.stdout)(this.buffer);
        this.clearBuffer();
    }
    clearBuffer() {
        this.previousBuffer = this.buffer;
        this.buffer = '';
    }
}
