"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const settings_1 = require("./settings");
(0, mocha_1.describe)('Settings', () => {
    (0, mocha_1.it)('should return instance with default values', () => {
        const settings = new settings_1.default();
        assert.deepStrictEqual(settings.fs, settings_1.DEFAULT_FILE_SYSTEM_ADAPTER);
        assert.deepStrictEqual(settings.ignore, []);
        assert.ok(!settings.absolute);
        assert.ok(!settings.baseNameMatch);
        assert.ok(!settings.dot);
        assert.ok(!settings.markDirectories);
        assert.ok(!settings.objectMode);
        assert.ok(!settings.onlyDirectories);
        assert.ok(!settings.stats);
        assert.ok(!settings.suppressErrors);
        assert.ok(!settings.errorHandler);
        assert.ok(!settings.throwErrorOnBrokenSymbolicLink);
        assert.ok(settings.braceExpansion);
        assert.ok(settings.caseSensitiveMatch);
        assert.ok(settings.deep);
        assert.ok(settings.extglob);
        assert.ok(settings.followSymbolicLinks);
        assert.ok(settings.globstar);
        assert.ok(settings.onlyFiles);
        assert.ok(settings.unique);
        assert.strictEqual(settings.cwd, process.cwd());
        assert.strictEqual(settings.signal, undefined);
    });
    (0, mocha_1.it)('should return instance with custom values', () => {
        const settings = new settings_1.default({
            onlyFiles: false,
        });
        assert.ok(!settings.onlyFiles);
    });
    (0, mocha_1.it)('should set the "onlyFiles" option when the "onlyDirectories" is enabled', () => {
        const settings = new settings_1.default({
            onlyDirectories: true,
        });
        assert.ok(!settings.onlyFiles);
        assert.ok(settings.onlyDirectories);
    });
    (0, mocha_1.it)('should set the "objectMode" option when the "stats" is enabled', () => {
        const settings = new settings_1.default({
            stats: true,
        });
        assert.ok(settings.objectMode);
        assert.ok(settings.stats);
    });
    (0, mocha_1.it)('should return the `fs` option with custom method', () => {
        const customReaddirSync = () => [];
        const settings = new settings_1.default({
            fs: { readdirSync: customReaddirSync },
        });
        assert.strictEqual(settings.fs.readdirSync, customReaddirSync);
    });
});
