"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const fs_macchiato_1 = require("@nodelib/fs.macchiato");
const sinon = require("sinon");
const mocha_1 = require("mocha");
const settings_1 = require("../settings");
const tests = require("../tests");
const sync_1 = require("./sync");
class TestReader extends sync_1.ReaderSync {
    _walkSync = sinon.stub();
    _statSync = sinon.stub();
    constructor(options) {
        super(new settings_1.default(options));
    }
    get walkSync() {
        return this._walkSync;
    }
    get statSync() {
        return this._statSync;
    }
}
function getReader(options) {
    return new TestReader(options);
}
function getReaderOptions(options = {}) {
    return { ...options };
}
(0, mocha_1.describe)('Readers → ReaderSync', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const reader = getReader();
            assert.ok(reader instanceof TestReader);
        });
    });
    (0, mocha_1.describe)('.dynamic', () => {
        (0, mocha_1.it)('should call fs.walk method', () => {
            const reader = getReader();
            const readerOptions = getReaderOptions();
            reader.dynamic('root', readerOptions);
            assert.ok(reader.walkSync.called);
        });
    });
    (0, mocha_1.describe)('.static', () => {
        (0, mocha_1.it)('should return entries', () => {
            const reader = getReader();
            const readerOptions = getReaderOptions({ entryFilter: () => true });
            reader.statSync.onFirstCall().returns(new fs_macchiato_1.Stats());
            reader.statSync.onSecondCall().returns(new fs_macchiato_1.Stats());
            const actual = reader.static(['a.txt', 'b.txt'], readerOptions);
            assert.strictEqual(actual[0].name, 'a.txt');
            assert.strictEqual(actual[1].name, 'b.txt');
        });
        (0, mocha_1.it)('should throw an error when the filter does not suppress the error', () => {
            const reader = getReader();
            const readerOptions = getReaderOptions({
                errorFilter: () => false,
                entryFilter: () => true,
            });
            reader.statSync.onFirstCall().throws(tests.errno.getEperm());
            reader.statSync.onSecondCall().returns(new fs_macchiato_1.Stats());
            const expectedErrorMessageRe = /Error: EPERM: operation not permitted/;
            assert.throws(() => reader.static(['a.txt', 'b.txt'], readerOptions), expectedErrorMessageRe);
        });
        (0, mocha_1.it)('should do not throw an error when the filter suppress the error', () => {
            const reader = getReader();
            const readerOptions = getReaderOptions({
                errorFilter: () => true,
                entryFilter: () => true,
            });
            reader.statSync.onFirstCall().throws(tests.errno.getEnoent());
            reader.statSync.onSecondCall().returns(new fs_macchiato_1.Stats());
            const actual = reader.static(['a.txt', 'b.txt'], readerOptions);
            assert.strictEqual(actual.length, 1);
            assert.strictEqual(actual[0].name, 'b.txt');
        });
        (0, mocha_1.it)('should do not include entry when the filter excludes it', () => {
            const reader = getReader();
            const readerOptions = getReaderOptions({ entryFilter: () => false });
            reader.statSync.returns(new fs_macchiato_1.Stats());
            const actual = reader.static(['a.txt'], readerOptions);
            assert.strictEqual(actual.length, 0);
        });
    });
});
