"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const path = require("node:path");
const mocha_1 = require("mocha");
const settings_1 = require("../../settings");
const tests = require("../../tests");
const entry_1 = require("./entry");
function getEntryTransformer(options) {
    return new entry_1.default(new settings_1.default(options));
}
function getTransformer(options) {
    return getEntryTransformer(options).getTransformer();
}
(0, mocha_1.describe)('Providers → Transformers → Entry', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const filter = getEntryTransformer();
            assert.ok(filter instanceof entry_1.default);
        });
    });
    (0, mocha_1.describe)('.getTransformer', () => {
        (0, mocha_1.it)('should return transformed entry as string when options is not provided', () => {
            const transformer = getTransformer();
            const entry = tests.entry.builder().path('root/file.txt').file().build();
            const expected = 'root/file.txt';
            const actual = transformer(entry);
            assert.strictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return transformed entry as object when the `objectMode` option is enabled', () => {
            const transformer = getTransformer({ objectMode: true });
            const entry = tests.entry.builder().path('root/file.txt').file().build();
            const expected = entry;
            const actual = transformer(entry);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return transformed entry as object when the `stats` option is enabled', () => {
            const transformer = getTransformer({ stats: true });
            const entry = tests.entry.builder().path('root/file.txt').file().stats().build();
            const expected = entry;
            const actual = transformer(entry);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return entry with absolute filepath when the `absolute` option is enabled', () => {
            const transformer = getTransformer({ absolute: true });
            const entry = tests.entry.builder().path('root/file.txt').file().build();
            const expected = path.join(process.cwd(), 'root', 'file.txt');
            const actual = transformer(entry);
            assert.strictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return entry with trailing slash when the `markDirectories` is enabled', () => {
            const transformer = getTransformer({ markDirectories: true });
            const entry = tests.entry.builder().path('root/directory').directory().build();
            const expected = 'root/directory/';
            const actual = transformer(entry);
            assert.strictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return correct entry when the `absolute` and `markDirectories` options is enabled', () => {
            const transformer = getTransformer({ absolute: true, markDirectories: true });
            const entry = tests.entry.builder().path('root/directory').directory().build();
            const expected = path.join(process.cwd(), 'root', 'directory', '/');
            const actual = transformer(entry);
            assert.strictEqual(actual, expected);
        });
        (0, mocha_1.it)('should do not mutate the entry when the `markDirectories` option is enabled', () => {
            const transformer = getTransformer({ markDirectories: true });
            const entry = tests.entry.builder().path('root/directory').directory().build();
            const actual = transformer(entry);
            assert.notStrictEqual(actual, entry.path);
        });
    });
});
