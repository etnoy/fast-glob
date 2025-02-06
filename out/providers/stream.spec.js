"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const node_stream_1 = require("node:stream");
const sinon = require("sinon");
const mocha_1 = require("mocha");
const settings_1 = require("../settings");
const tests = require("../tests");
const stream_1 = require("./stream");
const readers_1 = require("../readers");
class TestProvider extends stream_1.ProviderStream {
    reader;
    constructor(options, reader = sinon.createStubInstance(readers_1.ReaderStream)) {
        super(reader, new settings_1.default(options));
        this.reader = reader;
    }
}
function getProvider(options) {
    return new TestProvider(options);
}
function getEntries(provider, task, entry) {
    const reader = new node_stream_1.PassThrough({ objectMode: true });
    provider.reader.dynamic.returns(reader);
    provider.reader.static.returns(reader);
    reader.push(entry);
    reader.push(null);
    return new Promise((resolve, reject) => {
        const items = [];
        const api = provider.read(task);
        api.on('data', (item) => items.push(item));
        api.once('error', reject);
        api.once('end', () => {
            resolve(items);
        });
    });
}
(0, mocha_1.describe)('Providers → ProviderStream', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const provider = getProvider();
            assert.ok(provider instanceof stream_1.ProviderStream);
        });
    });
    (0, mocha_1.describe)('.read', () => {
        (0, mocha_1.it)('should return entries for dynamic entries', async () => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').positive('*').build();
            const entry = tests.entry.builder().path('root/file.txt').file().build();
            const expected = ['root/file.txt'];
            const actual = await getEntries(provider, task, entry);
            assert.strictEqual(provider.reader.dynamic.callCount, 1);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return entries for static entries', async () => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').static().positive('root/file.txt').build();
            const entry = tests.entry.builder().path('root/file.txt').file().build();
            const expected = ['root/file.txt'];
            const actual = await getEntries(provider, task, entry);
            assert.strictEqual(provider.reader.static.callCount, 1);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should emit error to the transform stream', (done) => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').positive('*').build();
            const stream = new node_stream_1.PassThrough({
                read() {
                    stream.emit('error', tests.errno.getEnoent());
                },
            });
            provider.reader.dynamic.returns(stream);
            const actual = provider.read(task);
            actual.once('error', (error) => {
                assert.strictEqual(error.code, 'ENOENT');
                done();
            });
        });
        (0, mocha_1.it)('should destroy source stream when the destination stream is closed', (done) => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').positive('*').build();
            const stream = new node_stream_1.PassThrough();
            provider.reader.dynamic.returns(stream);
            const actual = provider.read(task);
            actual.once('close', () => {
                assert.ok(stream.destroyed);
                done();
            });
            actual.emit('close');
        });
    });
});
