"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const tests = require("../../tests");
const settings_1 = require("../../settings");
const matcher_1 = require("./matcher");
class TestMatcher extends matcher_1.default {
    get storage() {
        return this._storage;
    }
}
function getMatcher(patterns, options = {}) {
    return new TestMatcher(patterns, new settings_1.default(), options);
}
(0, mocha_1.describe)('Providers → Matchers → Matcher', () => {
    (0, mocha_1.describe)('.storage', () => {
        (0, mocha_1.it)('should return created storage', () => {
            const matcher = getMatcher(['a*', 'a/**/b']);
            const expected = [
                tests.pattern.info()
                    .section(tests.pattern.segment().dynamic().pattern('a*').build())
                    .build(),
                tests.pattern.info()
                    .section(tests.pattern.segment().pattern('a').build())
                    .section(tests.pattern.segment().pattern('b').build())
                    .build(),
            ];
            const actual = matcher.storage;
            assert.deepStrictEqual(actual, expected);
        });
    });
});
