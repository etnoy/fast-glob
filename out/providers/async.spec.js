"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const sinon = require("sinon");
const mocha_1 = require("mocha");
const settings_1 = require("../settings");
const tests = require("../tests");
const readers_1 = require("../readers");
const async_1 = require("./async");
class TestProvider extends async_1.ProviderAsync {
    reader;
    constructor(options, reader = sinon.createStubInstance(readers_1.ReaderAsync)) {
        super(reader, new settings_1.default(options));
        this.reader = reader;
    }
}
function getProvider(options) {
    return new TestProvider(options);
}
function getEntries(provider, task, entry) {
    provider.reader.dynamic.resolves([entry]);
    provider.reader.static.resolves([entry]);
    return provider.read(task);
}
(0, mocha_1.describe)('Providers → ProviderAsync', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const provider = getProvider();
            assert.ok(provider instanceof async_1.ProviderAsync);
        });
    });
    (0, mocha_1.describe)('.read', () => {
        (0, mocha_1.it)('should return entries for dynamic task', async () => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').positive('*').build();
            const entry = tests.entry.builder().path('root/file.txt').build();
            const expected = ['root/file.txt'];
            const actual = await getEntries(provider, task, entry);
            assert.strictEqual(provider.reader.dynamic.callCount, 1);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return entries for static task', async () => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').static().positive('*').build();
            const entry = tests.entry.builder().path('root/file.txt').build();
            const expected = ['root/file.txt'];
            const actual = await getEntries(provider, task, entry);
            assert.strictEqual(provider.reader.static.callCount, 1);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should throw error', async () => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').positive('*').build();
            provider.reader.dynamic.rejects(tests.errno.getEnoent());
            try {
                await provider.read(task);
                throw new Error('Wow');
            }
            catch (error) {
                assert.strictEqual(error.code, 'ENOENT');
            }
        });
    });
});
