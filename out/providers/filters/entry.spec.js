"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const path = require("node:path");
const mocha_1 = require("mocha");
const settings_1 = require("../../settings");
const tests = require("../../tests");
const entry_1 = require("./entry");
const FILE_ENTRY = tests.entry.builder().path('root/file.txt').file().build();
const SOCKET_ENTRY = tests.entry.builder().path('/tmp/test.sock').socket().build();
const DIRECTORY_ENTRY = tests.entry.builder().path('root/directory').directory().build();
function getEntryFilterInstance(options) {
    const settings = new settings_1.default(options);
    return new entry_1.default(settings, {
        dot: settings.dot,
    });
}
function getFilter(options) {
    const negative = options.negative ?? [];
    return getEntryFilterInstance(options.options).getFilter(options.positive, negative);
}
function getResult(entry, options) {
    const filter = getFilter(options);
    return filter(entry);
}
function accept(entry, options) {
    assert.strictEqual(getResult(entry, options), true);
}
function reject(entry, options) {
    assert.strictEqual(getResult(entry, options), false);
}
(0, mocha_1.describe)('Providers → Filters → Entry', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const filter = getEntryFilterInstance();
            assert.ok(filter instanceof entry_1.default);
        });
    });
    (0, mocha_1.describe)('.getFilter', () => {
        (0, mocha_1.describe)('options.unique', () => {
            (0, mocha_1.it)('should do not build the index when an option is disabled', () => {
                const filterInstance = getEntryFilterInstance({ unique: false });
                const filter = filterInstance.getFilter(['**/*'], []);
                filter(FILE_ENTRY);
                assert.strictEqual(filterInstance.index.size, 0);
            });
            (0, mocha_1.it)('should do not add an entry to the index when an entry does not match to patterns', () => {
                const filterInstance = getEntryFilterInstance();
                const filter = filterInstance.getFilter(['**/*.unrelated-file-extension'], []);
                filter(FILE_ENTRY);
                assert.strictEqual(filterInstance.index.size, 0);
            });
            (0, mocha_1.it)('should reject a duplicate entry', () => {
                const filter = getFilter({
                    positive: ['**/*'],
                });
                filter(FILE_ENTRY);
                const actual = filter(FILE_ENTRY);
                assert.ok(!actual);
            });
            (0, mocha_1.it)('should reject a duplicate entry when the two entries differ only by the leading dot segment', () => {
                const first = tests.entry.builder().path('file.txt').file().build();
                const second = tests.entry.builder().path('./file.txt').file().build();
                const filter = getFilter({
                    positive: ['*', './file.txt'],
                });
                assert.ok(filter(first));
                assert.ok(!filter(second));
            });
            (0, mocha_1.it)('should accept a duplicate entry when an option is disabled', () => {
                const filter = getFilter({
                    positive: ['**/*'],
                    options: { unique: false },
                });
                filter(FILE_ENTRY);
                const actual = filter(FILE_ENTRY);
                assert.ok(actual);
            });
        });
        (0, mocha_1.describe)('options.onlyFiles', () => {
            (0, mocha_1.it)('should reject a directory entry', () => {
                reject(DIRECTORY_ENTRY, {
                    positive: ['**/*'],
                    options: { onlyFiles: true },
                });
            });
            (0, mocha_1.it)('should accept a directory entry', () => {
                accept(DIRECTORY_ENTRY, {
                    positive: ['**/*'],
                    options: { onlyFiles: false },
                });
            });
            (0, mocha_1.it)('should accept a file entry', () => {
                accept(FILE_ENTRY, {
                    positive: ['**/*'],
                    options: { onlyFiles: true },
                });
            });
            (0, mocha_1.it)('should accept a socket entry', () => {
                accept(SOCKET_ENTRY, {
                    positive: ['**/*'],
                    options: { onlyFiles: true },
                });
            });
        });
        (0, mocha_1.describe)('options.onlyDirectories', () => {
            (0, mocha_1.it)('should reject a file entry', () => {
                reject(FILE_ENTRY, {
                    positive: ['**/*'],
                    options: { onlyDirectories: true },
                });
            });
            (0, mocha_1.it)('should reject a socket entry', () => {
                reject(SOCKET_ENTRY, {
                    positive: ['**/*'],
                    options: { onlyDirectories: true },
                });
            });
            (0, mocha_1.it)('should accept a directory entry', () => {
                accept(DIRECTORY_ENTRY, {
                    positive: ['**/*'],
                    options: { onlyDirectories: true },
                });
            });
        });
        (0, mocha_1.describe)('options.absolute', () => {
            (0, mocha_1.it)('should reject when an entry match to the negative pattern', () => {
                reject(FILE_ENTRY, {
                    positive: ['**/*'],
                    negative: ['**/*'],
                    options: { absolute: true },
                });
            });
            (0, mocha_1.it)('should reject when an entry match to the negative pattern with absolute path', () => {
                const negative = path.posix.join(process.cwd().replaceAll('\\', '/'), '**', '*');
                reject(FILE_ENTRY, {
                    positive: ['**/*'],
                    negative: [negative],
                    options: { absolute: true },
                });
            });
            (0, mocha_1.it)('should accept when an entry does not match to the negative pattern', () => {
                accept(FILE_ENTRY, {
                    positive: ['**/*'],
                    negative: ['*'],
                    options: { absolute: true },
                });
            });
            (0, mocha_1.it)('should accept when an entry does not match to the negative pattern with absolute path', () => {
                const negative = path.posix.join(process.cwd().replaceAll('\\', '/'), 'non-root', '**', '*');
                accept(FILE_ENTRY, {
                    positive: ['**/*'],
                    negative: [negative],
                    options: { absolute: true },
                });
            });
        });
        (0, mocha_1.describe)('options.baseNameMatch', () => {
            (0, mocha_1.it)('should reject an entry', () => {
                reject(FILE_ENTRY, {
                    positive: ['file.txt'],
                    options: { baseNameMatch: false },
                });
            });
            (0, mocha_1.it)('should accept an entry', () => {
                accept(FILE_ENTRY, {
                    // The task manager adds globstar for patterns without slash.
                    positive: ['**/file.txt'],
                    options: { baseNameMatch: true },
                });
            });
        });
        (0, mocha_1.describe)('Pattern', () => {
            (0, mocha_1.it)('should reject when an entry match to the negative pattern', () => {
                reject(FILE_ENTRY, {
                    positive: ['**/*'],
                    negative: ['**/*'],
                });
            });
            (0, mocha_1.it)('should reject when an entry does not match to the positive pattern', () => {
                reject(FILE_ENTRY, {
                    positive: ['*'],
                });
            });
            (0, mocha_1.it)('should accept when an entry match to the positive pattern with a leading dot', () => {
                accept(FILE_ENTRY, {
                    positive: ['./**/*'],
                });
            });
            (0, mocha_1.it)('should accept an entry with a leading dot', () => {
                const entry = tests.entry.builder().path('./root/file.txt').file().build();
                accept(entry, {
                    positive: ['**/*'],
                });
            });
            (0, mocha_1.it)('should accept when an entry match to the positive pattern', () => {
                accept(FILE_ENTRY, {
                    positive: ['**/*'],
                });
            });
            (0, mocha_1.it)('should try to apply patterns to the path with the trailing slash for directory entry', () => {
                accept(DIRECTORY_ENTRY, {
                    positive: ['**/'],
                    options: { onlyFiles: false },
                });
            });
            (0, mocha_1.it)('should not try to apply patterns to the path with the trailing slash for non-directory entry', () => {
                reject(FILE_ENTRY, {
                    positive: ['**/'],
                    options: { onlyFiles: false },
                });
            });
            (0, mocha_1.it)('should reject a hidden entry by negative pattern even when the dot options is disabled', () => {
                const entry = tests.entry.builder().path('root/files/.hidden.txt').file().build();
                reject(entry, {
                    positive: ['**/!(ignore)*.txt'],
                    negative: ['**/files/**/*'],
                    options: { dot: false },
                });
            });
        });
    });
    (0, mocha_1.describe)('Immutability', () => {
        (0, mocha_1.it)('should return the data without changes', () => {
            const filter = getFilter({
                positive: ['**/*'],
            });
            const reference = tests.entry.builder().path('root/file.txt').file().build();
            const entry = tests.entry.builder().path('root/file.txt').file().build();
            filter(entry);
            assert.deepStrictEqual(entry, reference);
        });
    });
});
