"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const settings_1 = require("../../settings");
const tests = require("../../tests");
const error_1 = require("./error");
function getErrorFilterInstance(options) {
    const settings = new settings_1.default(options);
    return new error_1.default(settings);
}
function getFilter(options) {
    return getErrorFilterInstance(options).getFilter();
}
(0, mocha_1.describe)('Providers → Filters → Error', () => {
    (0, mocha_1.describe)('Constructor', () => {
        (0, mocha_1.it)('should create instance of class', () => {
            const filter = getErrorFilterInstance();
            assert.ok(filter instanceof error_1.default);
        });
    });
    (0, mocha_1.describe)('.getFilter', () => {
        (0, mocha_1.it)('should return true for ENOENT error', () => {
            const filter = getFilter();
            const actual = filter(tests.errno.getEnoent());
            assert.ok(actual);
        });
        (0, mocha_1.it)('should return true for EPERM error when the `suppressErrors` options is enabled', () => {
            const filter = getFilter({ suppressErrors: true });
            const actual = filter(tests.errno.getEperm());
            assert.ok(actual);
        });
        (0, mocha_1.it)('should return false for EPERM error', () => {
            const filter = getFilter();
            const actual = filter(tests.errno.getEperm());
            assert.ok(!actual);
        });
        (0, mocha_1.it)('should return false for EACCES error', () => {
            const filter = getFilter();
            const actual = filter(tests.errno.getEacces());
            assert.ok(!actual);
        });
    });
});
