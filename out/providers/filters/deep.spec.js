"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const settings_1 = require("../../settings");
const tests = require("../../tests");
const deep_1 = require("./deep");
const DIRECTORY_ENTRY_LEVEL_1 = tests.entry.builder().path('root').directory().build();
const DIRECTORY_ENTRY_LEVEL_2 = tests.entry.builder().path('root/directory').directory().build();
const DIRECTORY_ENTRY_LEVEL_3 = tests.entry.builder().path('root/nested/directory').directory().build();
function getDeepFilterInstance(options) {
    const settings = new settings_1.default(options);
    return new deep_1.default(settings, {
        dot: settings.dot,
    });
}
function getFilter(options) {
    const base = options.base ?? '.';
    const negative = options.negative ?? [];
    return getDeepFilterInstance(options.options).getFilter(base, options.positive, negative);
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
(0, mocha_1.describe)('Providers → Filters → Deep', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const filter = getDeepFilterInstance();
            assert.ok(filter instanceof deep_1.default);
        });
    });
    (0, mocha_1.describe)('.getFilter', () => {
        (0, mocha_1.describe)('options.deep', () => {
            (0, mocha_1.it)('should reject when an option has "0" as value', () => {
                reject(DIRECTORY_ENTRY_LEVEL_1, {
                    positive: ['**/*'],
                    options: { deep: 0 },
                });
            });
            (0, mocha_1.it)('should reject when the depth of entry is greater than an allowable value (without base)', () => {
                reject(DIRECTORY_ENTRY_LEVEL_3, {
                    positive: ['**/*'],
                    options: { deep: 1 },
                });
            });
            (0, mocha_1.it)('should reject when the depth of entry is greater than an allowable value (with base as current level)', () => {
                reject(DIRECTORY_ENTRY_LEVEL_3, {
                    positive: ['**/*'],
                    options: { deep: 1 },
                });
            });
            (0, mocha_1.it)('should reject when the depth of entry is greater than an allowable value (with nested base)', () => {
                reject(DIRECTORY_ENTRY_LEVEL_3, {
                    base: 'root/a',
                    positive: ['root/a/*'],
                    options: { deep: 1 },
                });
            });
            (0, mocha_1.it)('should accept when an option has "Infinity" as value', () => {
                accept(DIRECTORY_ENTRY_LEVEL_1, {
                    positive: ['**/*'],
                    options: { deep: Number.POSITIVE_INFINITY },
                });
            });
        });
        (0, mocha_1.describe)('options.followSymbolicLinks', () => {
            (0, mocha_1.it)('should reject when an entry is symbolic link and option is disabled', () => {
                const entry = tests.entry.builder().path('root').directory().symlink().build();
                reject(entry, {
                    positive: ['**/*'],
                    options: { followSymbolicLinks: false },
                });
            });
            (0, mocha_1.it)('should accept when an entry is symbolic link and option is enabled', () => {
                const entry = tests.entry.builder().path('root').directory().symlink().build();
                accept(entry, {
                    positive: ['**/*'],
                    options: { followSymbolicLinks: true },
                });
            });
        });
        (0, mocha_1.describe)('Positive pattern', () => {
            (0, mocha_1.it)('should reject when an entry does not match to the positive pattern', () => {
                reject(DIRECTORY_ENTRY_LEVEL_1, {
                    positive: ['non-root/*'],
                });
            });
            (0, mocha_1.it)('should reject when an entry starts with leading dot and does not match to the positive pattern', () => {
                const entry = tests.entry.builder().path('./root').directory().build();
                reject(entry, {
                    positive: ['non-root/*'],
                });
            });
            (0, mocha_1.it)('should accept when an entry match to the positive pattern with leading dot', () => {
                const entry = tests.entry.builder().path('./root').directory().build();
                accept(entry, {
                    positive: ['./root/*'],
                });
            });
            (0, mocha_1.it)('should accept when the positive pattern does not match by level, but the "baseNameMatch" is enabled', () => {
                accept(DIRECTORY_ENTRY_LEVEL_2, {
                    positive: ['*'],
                    options: { baseNameMatch: true },
                });
            });
            (0, mocha_1.it)('should accept when the positive pattern has a globstar', () => {
                accept(DIRECTORY_ENTRY_LEVEL_3, {
                    positive: ['**/*'],
                });
            });
        });
        (0, mocha_1.describe)('Negative pattern', () => {
            (0, mocha_1.it)('should reject when an entry match to the negative pattern', () => {
                reject(DIRECTORY_ENTRY_LEVEL_2, {
                    positive: ['**/*'],
                    negative: ['root/**'],
                });
            });
            (0, mocha_1.it)('should accept when the negative pattern has no effect to depth reading', () => {
                accept(DIRECTORY_ENTRY_LEVEL_3, {
                    positive: ['**/*'],
                    negative: ['**/*'],
                });
            });
            (0, mocha_1.it)('should accept when an entry does not match to the negative pattern', () => {
                accept(DIRECTORY_ENTRY_LEVEL_3, {
                    positive: ['**/*'],
                    negative: ['non-root/**/*'],
                });
            });
        });
    });
    (0, mocha_1.describe)('Immutability', () => {
        (0, mocha_1.it)('should return the data without changes', () => {
            const filter = getFilter({
                positive: ['**/*'],
            });
            const reference = tests.entry.builder().path('root/directory').directory().build();
            const entry = tests.entry.builder().path('root/directory').directory().build();
            filter(entry);
            assert.deepStrictEqual(entry, reference);
        });
    });
});
