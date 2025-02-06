"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const sinon = require("sinon");
const mocha_1 = require("mocha");
const readers_1 = require("../readers");
const settings_1 = require("../settings");
const tests = require("../tests");
const sync_1 = require("./sync");
class TestProvider extends sync_1.ProviderSync {
    reader;
    constructor(options, reader = sinon.createStubInstance(readers_1.ReaderSync)) {
        super(reader, new settings_1.default(options));
        this.reader = reader;
    }
}
function getProvider(options) {
    return new TestProvider(options);
}
(0, mocha_1.describe)('Providers → ProviderSync', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const provider = getProvider();
            assert.ok(provider instanceof sync_1.ProviderSync);
        });
    });
    (0, mocha_1.describe)('.read', () => {
        (0, mocha_1.it)('should return entries for dynamic task', () => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').positive('*').build();
            const entry = tests.entry.builder().path('root/file.txt').file().build();
            provider.reader.dynamic.returns([entry]);
            const expected = ['root/file.txt'];
            const actual = provider.read(task);
            assert.strictEqual(provider.reader.dynamic.callCount, 1);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return entries for static task', () => {
            const provider = getProvider();
            const task = tests.task.builder().base('.').static().positive('root/file.txt').build();
            const entry = tests.entry.builder().path('root/file.txt').file().build();
            provider.reader.static.returns([entry]);
            const expected = ['root/file.txt'];
            const actual = provider.read(task);
            assert.strictEqual(provider.reader.static.callCount, 1);
            assert.deepStrictEqual(actual, expected);
        });
    });
});
