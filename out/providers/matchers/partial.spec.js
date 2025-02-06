"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const settings_1 = require("../../settings");
const partial_1 = require("./partial");
function getMatcher(patterns, options = {}) {
    return new partial_1.default(patterns, new settings_1.default(), options);
}
function assertMatch(patterns, filepath) {
    const matcher = getMatcher(patterns);
    assert.ok(matcher.match(filepath), `Path "${filepath}" should match: ${patterns.join(', ')}`);
}
function assertNotMatch(patterns, filepath) {
    const matcher = getMatcher(patterns);
    assert.ok(!matcher.match(filepath), `Path "${filepath}" should do not match: ${patterns.join(', ')}`);
}
(0, mocha_1.describe)('Providers → Matchers → Partial', () => {
    (0, mocha_1.describe)('.match', () => {
        (0, mocha_1.it)('should handle patterns with globstar', () => {
            assertMatch(['**'], 'a');
            assertMatch(['**'], './a');
            assertMatch(['**/a'], 'a');
            assertMatch(['**/a'], 'b/a');
            assertMatch(['a/**'], 'a/b');
            assertNotMatch(['a/**'], 'b');
        });
        (0, mocha_1.it)('should do not match the latest segment', () => {
            assertMatch(['b/*'], 'b');
            assertNotMatch(['*'], 'a');
            assertNotMatch(['a/*'], 'a/b');
        });
        (0, mocha_1.it)('should trying to match all patterns', () => {
            assertMatch(['a/*', 'b/*'], 'b');
            assertMatch(['non-match/b/c', 'a/*/c'], 'a/b');
            assertNotMatch(['non-match/d/c', 'a/b/c'], 'a/d');
        });
        (0, mocha_1.it)('should match a static segment', () => {
            assertMatch(['a/b'], 'a');
            assertNotMatch(['b/b'], 'a');
        });
        (0, mocha_1.it)('should match a dynamic segment', () => {
            assertMatch(['*/b'], 'a');
            assertMatch(['{a,b}/*'], 'a');
            assertNotMatch(['{a,b}/*'], 'c');
        });
    });
});
