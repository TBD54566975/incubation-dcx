import ansiEscapes from 'ansi-escapes';
export class BaseUi {
    freezed = false;
    _position;
    _visible = true;
    stdout = process.stdout;
    printAt(message, position) {
        this.setCursorAt(position);
        this.print(message);
    }
    setCursorAt({ x, y }) {
        this.print(ansiEscapes.cursorTo(x, y));
    }
    print(text) {
        if (this.freezed) {
            return;
        }
        process.stdout.write.bind(process.stdout)(text);
    }
    clearLine(row) {
        this.printAt(ansiEscapes.eraseLine, { x: 0, y: row });
    }
    setPosition(position, renderOnSet = true) {
        this._position = position;
        if (renderOnSet) {
            this.render();
        }
    }
    setVisible(visible, renderOnSet = true) {
        this._visible = visible;
        if (renderOnSet) {
            this.render();
        }
    }
    get position() {
        return this._position;
    }
    get visible() {
        return this._visible;
    }
    get terminal() {
        return {
            columns: this.stdout.columns,
            rows: this.stdout.rows,
        };
    }
}
