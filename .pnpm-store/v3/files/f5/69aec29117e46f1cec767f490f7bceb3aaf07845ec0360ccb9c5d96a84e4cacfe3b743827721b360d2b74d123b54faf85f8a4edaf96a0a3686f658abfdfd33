export const FOLDER_SORT = {
    path: (a, b) => (a.path > b.path ? 1 : -1),
    size: (a, b) => (a.size < b.size ? 1 : -1),
    'last-mod': (a, b) => {
        if (a.modificationTime === b.modificationTime) {
            return FOLDER_SORT.path(a, b);
        }
        if (a.modificationTime === null && b.modificationTime !== null) {
            return 1;
        }
        if (b.modificationTime === null && a.modificationTime !== null) {
            return -1;
        }
        return a.modificationTime - b.modificationTime;
    },
};
