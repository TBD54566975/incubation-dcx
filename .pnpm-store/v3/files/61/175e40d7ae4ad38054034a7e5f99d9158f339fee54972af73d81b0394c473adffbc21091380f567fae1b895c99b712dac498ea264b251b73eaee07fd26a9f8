/**
 * A class that represents an ION error.
 */
export default class IonError extends Error {
    constructor(code, message) {
        super(`${code}: ${message}`);
        this.code = code;
        // NOTE: Extending 'Error' breaks prototype chain since TypeScript 2.1.
        // The following line restores prototype chain.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
//# sourceMappingURL=IonError.js.map