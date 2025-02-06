"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const util = require("./string");
(0, mocha_1.describe)('Utils → String', () => {
    (0, mocha_1.describe)('.isString', () => {
        (0, mocha_1.it)('should return true', () => {
            const actual = util.isString('');
            assert.ok(actual);
        });
        (0, mocha_1.it)('should return false', () => {
            const actual = util.isString(undefined);
            assert.ok(!actual);
        });
    });
    (0, mocha_1.describe)('.isEmpty', () => {
        (0, mocha_1.it)('should return true', () => {
            const actual = util.isEmpty('');
            assert.ok(actual);
        });
        (0, mocha_1.it)('should return false', () => {
            const actual = util.isEmpty('string');
            assert.ok(!actual);
        });
    });
});
