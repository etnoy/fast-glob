"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const path = require("node:path");
const mocha_1 = require("mocha");
const settings_1 = require("../settings");
const tests = require("../tests");
const provider_1 = require("./provider");
class TestProvider extends provider_1.Provider {
    read() {
        return [];
    }
    getRootDirectory(task) {
        return this._getRootDirectory(task);
    }
    getReaderOptions(task) {
        return this._getReaderOptions(task);
    }
    getMicromatchOptions() {
        return this._getMicromatchOptions();
    }
}
function getProvider(options) {
    const settings = new settings_1.default(options);
    return new TestProvider(settings);
}
(0, mocha_1.describe)('Providers → Provider', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const provider = getProvider();
            assert.ok(provider instanceof provider_1.Provider);
        });
    });
    (0, mocha_1.describe)('.getRootDirectory', () => {
        (0, mocha_1.it)('should return root directory for reader with global base (.)', () => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').build();
            const expected = process.cwd();
            const actual = provider.getRootDirectory(task);
            assert.strictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return root directory for reader with non-global base (fixtures)', () => {
            const provider = getProvider();
            const task = tests.task.builder().base('root').build();
            const expected = path.join(process.cwd(), 'root');
            const actual = provider.getRootDirectory(task);
            assert.strictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.getReaderOptions', () => {
        (0, mocha_1.it)('should return options for reader with global base (.)', () => {
            const settings = new settings_1.default();
            const provider = getProvider(settings);
            const task = tests.task.builder().base('.').positive('*').build();
            const actual = provider.getReaderOptions(task);
            assert.strictEqual(actual.basePath, '');
            assert.strictEqual(typeof actual.deepFilter, 'function');
            assert.strictEqual(typeof actual.entryFilter, 'function');
            assert.strictEqual(typeof actual.errorFilter, 'function');
            assert.strictEqual(actual.followSymbolicLinks, true);
            assert.strictEqual(typeof actual.fs, 'object');
            assert.ok(!actual.stats);
            assert.ok(actual.throwErrorOnBrokenSymbolicLink === false);
            assert.strictEqual(typeof actual.transform, 'function');
            assert.strictEqual(actual.signal, undefined);
        });
        (0, mocha_1.it)('should return options for reader with non-global base', () => {
            const provider = getProvider();
            const task = tests.task.builder().base('root').positive('*').build();
            const actual = provider.getReaderOptions(task);
            assert.strictEqual(actual.basePath, 'root');
        });
    });
    (0, mocha_1.describe)('.getMicromatchOptions', () => {
        (0, mocha_1.it)('should return options for micromatch', () => {
            const provider = getProvider();
            const expected = {
                dot: false,
                matchBase: false,
                nobrace: false,
                nocase: false,
                noext: false,
                noglobstar: false,
                posix: true,
                strictSlashes: false,
            };
            const actual = provider.getMicromatchOptions();
            assert.deepStrictEqual(actual, expected);
        });
    });
});
