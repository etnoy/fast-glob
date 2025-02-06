"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const fs_macchiato_1 = require("@nodelib/fs.macchiato");
const mocha_1 = require("mocha");
const util = require("./fs");
(0, mocha_1.describe)('Utils → FS', () => {
    (0, mocha_1.describe)('.createDirentFromStats', () => {
        (0, mocha_1.it)('should convert fs.Stats to fs.Dirent', () => {
            const stats = new fs_macchiato_1.Stats({ mode: fs_macchiato_1.StatsMode.File });
            const actual = util.createDirentFromStats('name', stats);
            assert.strictEqual(actual.name, 'name');
            assert.ok(!actual.isBlockDevice());
            assert.ok(!actual.isCharacterDevice());
            assert.ok(!actual.isDirectory());
            assert.ok(!actual.isFIFO());
            assert.ok(actual.isFile());
            assert.ok(!actual.isSocket());
            assert.ok(!actual.isSymbolicLink());
        });
    });
});
