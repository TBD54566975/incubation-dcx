import ansiEscapes from 'ansi-escapes';
export class UiService {
    stdin = process.stdin;
    // public stdout: NodeJS.WriteStream = process.stdout;
    uiComponents = [];
    setRawMode(set = true) {
        this.stdin.setRawMode(set);
        process.stdin.resume();
    }
    setCursorVisible(visible) {
        const instruction = visible
            ? ansiEscapes.cursorShow
            : ansiEscapes.cursorHide;
        this.print(instruction);
    }
    add(component) {
        this.uiComponents.push(component);
    }
    renderAll() {
        this.clear();
        this.uiComponents.forEach((component) => {
            if (component.visible) {
                component.render();
            }
        });
    }
    clear() {
        this.print(ansiEscapes.clearTerminal);
    }
    print(text) {
        process.stdout.write.bind(process.stdout)(text);
    }
    printAt(message, position) {
        this.setCursorAt(position);
        this.print(message);
    }
    setCursorAt({ x, y }) {
        this.print(ansiEscapes.cursorTo(x, y));
    }
    clearLine(row) {
        this.printAt(ansiEscapes.eraseLine, { x: 0, y: row });
    }
}
