"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const fs_macchiato_1 = require("@nodelib/fs.macchiato");
const sinon = require("sinon");
const mocha_1 = require("mocha");
const settings_1 = require("../settings");
const tests = require("../tests");
const stream_1 = require("./stream");
class TestReader extends stream_1.ReaderStream {
    _walkStream = sinon.stub();
    _stat = sinon.stub();
    constructor(options) {
        super(new settings_1.default(options));
    }
    get walkStream() {
        return this._walkStream;
    }
    get stat() {
        return this._stat;
    }
}
function getReader(options) {
    return new TestReader(options);
}
function getReaderOptions(options = {}) {
    return { ...options };
}
(0, mocha_1.describe)('Readers → ReaderStream', () => {
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
            assert.ok(reader.walkStream.called);
        });
    });
    (0, mocha_1.describe)('.static', () => {
        (0, mocha_1.it)('should return entries', (done) => {
            const reader = getReader();
            const readerOptions = getReaderOptions({ entryFilter: () => true });
            reader.stat.onFirstCall().yields(null, new fs_macchiato_1.Stats());
            reader.stat.onSecondCall().yields(null, new fs_macchiato_1.Stats());
            const entries = [];
            const stream = reader.static(['a.txt', 'b.txt'], readerOptions);
            stream.on('data', (entry) => entries.push(entry));
            stream.once('end', () => {
                assert.strictEqual(entries[0].name, 'a.txt');
                assert.strictEqual(entries[1].name, 'b.txt');
                done();
            });
        });
        (0, mocha_1.it)('should throw an error when the filter does not suppress the error', (done) => {
            const reader = getReader();
            const readerOptions = getReaderOptions({
                errorFilter: () => false,
                entryFilter: () => true,
            });
            reader.stat.onFirstCall().yields(tests.errno.getEperm());
            reader.stat.onSecondCall().yields(null, new fs_macchiato_1.Stats());
            const entries = [];
            const stream = reader.static(['a.txt', 'b.txt'], readerOptions);
            stream.on('data', (entry) => entries.push(entry));
            stream.once('error', (error) => {
                assert.strictEqual(error.code, 'EPERM');
                done();
            });
        });
        (0, mocha_1.it)('should do not throw an error when the filter suppress the error', (done) => {
            const reader = getReader();
            const readerOptions = getReaderOptions({
                errorFilter: () => true,
                entryFilter: () => true,
            });
            reader.stat.onFirstCall().yields(tests.errno.getEnoent());
            reader.stat.onSecondCall().yields(null, new fs_macchiato_1.Stats());
            const entries = [];
            const stream = reader.static(['a.txt', 'b.txt'], readerOptions);
            stream.on('data', (entry) => entries.push(entry));
            stream.once('end', () => {
                assert.strictEqual(entries.length, 1);
                assert.strictEqual(entries[0].name, 'b.txt');
                done();
            });
        });
        (0, mocha_1.it)('should do not include entry when the filter excludes it', (done) => {
            const reader = getReader();
            const readerOptions = getReaderOptions({ entryFilter: () => false });
            reader.stat.yields(null, new fs_macchiato_1.Stats());
            const entries = [];
            const stream = reader.static(['a.txt'], readerOptions);
            stream.on('data', (entry) => entries.push(entry));
            stream.once('end', () => {
                assert.strictEqual(entries.length, 0);
                done();
            });
        });
    });
});
