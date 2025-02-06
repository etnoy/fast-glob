"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const node_stream_1 = require("node:stream");
const sinon = require("sinon");
const mocha_1 = require("mocha");
const settings_1 = require("../settings");
const tests = require("../tests");
const async_1 = require("./async");
const stream_1 = require("./stream");
class TestReader extends async_1.ReaderAsync {
    _walkAsync = sinon.stub();
    _readerStream = sinon.createStubInstance(stream_1.ReaderStream);
    constructor(options) {
        super(new settings_1.default(options));
    }
    get walkAsync() {
        return this._walkAsync;
    }
    get readerStream() {
        return this._readerStream;
    }
}
function getReader(options) {
    return new TestReader(options);
}
function getReaderOptions(options = {}) {
    return { ...options };
}
(0, mocha_1.describe)('Readers → ReaderAsync', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const reader = getReader();
            assert.ok(reader instanceof TestReader);
        });
    });
    (0, mocha_1.describe)('.dynamic', () => {
        (0, mocha_1.it)('should call fs.walk method', async () => {
            const reader = getReader();
            const readerOptions = getReaderOptions();
            reader.walkAsync.yields(null, []);
            await reader.dynamic('root', readerOptions);
            assert.ok(reader.walkAsync.called);
        });
    });
    (0, mocha_1.describe)('.static', () => {
        (0, mocha_1.it)('should call stream reader method', async () => {
            const entry = tests.entry.builder().path('root/file.txt').build();
            const reader = getReader();
            const readerOptions = getReaderOptions();
            const readerStream = new node_stream_1.PassThrough({ objectMode: true });
            readerStream.push(entry);
            readerStream.push(null);
            reader.readerStream.static.returns(readerStream);
            await reader.static(['a.txt'], readerOptions);
            assert.ok(reader.readerStream.static.called);
        });
    });
});
