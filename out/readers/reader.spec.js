"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const path = require("node:path");
const fs_macchiato_1 = require("@nodelib/fs.macchiato");
const mocha_1 = require("mocha");
const settings_1 = require("../settings");
const reader_1 = require("./reader");
class TestReader extends reader_1.Reader {
    constructor(options) {
        super(new settings_1.default(options));
    }
    dynamic() {
        return [];
    }
    static() {
        return [];
    }
    getFullEntryPath(filepath) {
        return this._getFullEntryPath(filepath);
    }
    makeEntry(stats, pattern) {
        return this._makeEntry(stats, pattern);
    }
}
function getReader(options) {
    return new TestReader(options);
}
(0, mocha_1.describe)('Readers → Reader', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const reader = getReader();
            assert.ok(reader instanceof TestReader);
        });
    });
    (0, mocha_1.describe)('.getFullEntryPath', () => {
        (0, mocha_1.it)('should return path to entry', () => {
            const reader = getReader();
            const expected = path.join(process.cwd(), 'config.json');
            const actual = reader.getFullEntryPath('config.json');
            assert.strictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.makeEntry', () => {
        (0, mocha_1.it)('should return created entry', () => {
            const reader = getReader();
            const pattern = 'config.json';
            const stats = new fs_macchiato_1.Stats({ mode: fs_macchiato_1.StatsMode.File });
            const actual = reader.makeEntry(stats, pattern);
            assert.strictEqual(actual.name, pattern);
            assert.strictEqual(actual.path, pattern);
            assert.ok(actual.dirent.isFile());
        });
        (0, mocha_1.it)('should return created entry with fs.Stats', () => {
            const reader = getReader({ stats: true });
            const pattern = 'config.json';
            const actual = reader.makeEntry(new fs_macchiato_1.Stats(), pattern);
            assert.ok(actual.stats);
        });
    });
});
