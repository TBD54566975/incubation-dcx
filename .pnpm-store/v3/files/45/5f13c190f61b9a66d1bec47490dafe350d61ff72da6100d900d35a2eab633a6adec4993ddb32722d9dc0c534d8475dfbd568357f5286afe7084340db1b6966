import { OPTIONS, WIDTH_OVERFLOW } from '../constants/index.js';
import { extname } from 'path';
import * as readline from 'node:readline';
import { StartParameters } from '../models/start-parameters.model.js';
export class ConsoleService {
    getParameters(rawArgv) {
        // This needs a refactor, but fck, is a urgent update
        const rawProgramArgvs = this.removeSystemArgvs(rawArgv);
        const argvs = this.normalizeParams(rawProgramArgvs);
        const options = new StartParameters();
        argvs.forEach((argv, index) => {
            if (!this.isArgOption(argv) || !this.isValidOption(argv)) {
                return;
            }
            const nextArgv = argvs[index + 1];
            const option = this.getOption(argv);
            if (option === undefined) {
                throw new Error('Invalid option name.');
            }
            const optionName = option.name;
            options.add(optionName, this.isArgHavingParams(nextArgv) ? nextArgv : true);
        });
        return options;
    }
    splitWordsByWidth(text, width) {
        const splitRegex = new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g');
        const splitText = this.replaceString(text, splitRegex, '$1\n');
        return this.splitData(splitText);
    }
    splitData(data, separator = '\n') {
        if (data === '') {
            return [];
        }
        return data.split(separator);
    }
    replaceString(text, textToReplace, replaceValue) {
        return text.replace(textToReplace, replaceValue);
    }
    shortenText(text, width, startCut = 0) {
        if (!this.isValidShortenParams(text, width, startCut)) {
            return text;
        }
        const startPartB = text.length - (width - startCut - WIDTH_OVERFLOW.length);
        const partA = text.substring(startCut, -1);
        const partB = text.substring(startPartB, text.length);
        return partA + WIDTH_OVERFLOW + partB;
    }
    isRunningBuild() {
        return extname(import.meta.url) === '.js';
    }
    startListenKeyEvents() {
        readline.emitKeypressEvents(process.stdin);
    }
    /** Argvs can be specified for example by
     *  "--sort size" and "--sort=size". The main function
     *  expect the parameters as the first form so this
     *  method convert the second to first.
     */
    normalizeParams(argvs) {
        return argvs.join('=').split('=');
    }
    isValidShortenParams(text, width, startCut) {
        return (startCut <= width &&
            text.length >= width &&
            !this.isNegative(width) &&
            !this.isNegative(startCut));
    }
    removeSystemArgvs(allArgv) {
        return allArgv.slice(2);
    }
    isArgOption(argv) {
        return argv.charAt(0) === '-';
    }
    isArgHavingParams(nextArgv) {
        return (nextArgv !== undefined && nextArgv !== '' && !this.isArgOption(nextArgv));
    }
    isValidOption(arg) {
        return OPTIONS.some((option) => option.arg.includes(arg));
    }
    getOption(arg) {
        return OPTIONS.find((option) => option.arg.includes(arg));
    }
    isNegative(numb) {
        return numb < 0;
    }
}
