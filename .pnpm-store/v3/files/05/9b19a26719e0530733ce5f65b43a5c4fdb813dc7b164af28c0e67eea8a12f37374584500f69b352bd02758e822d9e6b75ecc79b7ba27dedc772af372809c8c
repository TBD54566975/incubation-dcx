export class StartParameters {
    values = {};
    add(key, value) {
        this.values[key] = value;
    }
    isTrue(key) {
        const value = this.values[key];
        return value !== undefined && (value === true || value !== 'false');
    }
    getString(key) {
        const value = this.values[key];
        if (typeof value === 'boolean') {
            return value.toString();
        }
        return value;
    }
}
