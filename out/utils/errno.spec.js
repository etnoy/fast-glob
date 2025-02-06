"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const tests = require("../tests");
const util = require("./errno");
(0, mocha_1.describe)('Utils → Errno', () => {
    (0, mocha_1.describe)('.isEnoentCodeError', () => {
        (0, mocha_1.it)('should return true for ENOENT error', () => {
            assert.ok(util.isEnoentCodeError(tests.errno.getEnoent()));
        });
        (0, mocha_1.it)('should return false for EPERM error', () => {
            assert.ok(!util.isEnoentCodeError(tests.errno.getEperm()));
        });
    });
});
