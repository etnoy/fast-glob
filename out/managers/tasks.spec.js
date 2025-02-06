"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const settings_1 = require("../settings");
const tests = require("../tests");
const manager = require("./tasks");
(0, mocha_1.describe)('Managers → Task', () => {
    (0, mocha_1.describe)('.generate', () => {
        (0, mocha_1.it)('should return task with negative patterns from «ignore» option', () => {
            const settings = new settings_1.default({ ignore: ['*.txt'] });
            const expected = [
                tests.task.builder().base('a').positive('a/*').negative('*.md').negative('*.txt').build(),
            ];
            const actual = manager.generate(['a/*', '!*.md'], settings);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return static and dynamic tasks', () => {
            const settings = new settings_1.default({ ignore: ['*.txt'] });
            const expected = [
                tests.task.builder().base('a').static().positive('a/file.json').negative('b/*.md').negative('*.txt').build(),
                tests.task.builder().base('b').positive('b/*').negative('b/*.md').negative('*.txt').build(),
            ];
            const actual = manager.generate(['a/file.json', 'b/*', '!b/*.md'], settings);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return only dynamic tasks when the `caseSensitiveMatch` option is enabled', () => {
            const settings = new settings_1.default({ caseSensitiveMatch: false });
            const expected = [
                tests.task.builder().base('a').positive('a/file.json').negative('b/*.md').build(),
                tests.task.builder().base('b').positive('b/*').negative('b/*.md').build(),
            ];
            const actual = manager.generate(['a/file.json', 'b/*', '!b/*.md'], settings);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should expand patterns with brace expansion', () => {
            const settings = new settings_1.default();
            const expected = [
                tests.task.builder().base('a').positive('a/*').build(),
                tests.task.builder().base('a/b').positive('a/b/*').build(),
            ];
            const actual = manager.generate(['a/{b,}/*'], settings);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should do not expand patterns with brace expansion when the `braceExpansion` option is disabled', () => {
            const settings = new settings_1.default({ braceExpansion: false });
            const expected = [
                tests.task.builder().base('a').positive('a/{b,}/*').build(),
            ];
            const actual = manager.generate(['a/{b,}/*'], settings);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should do not process patterns when the `baseNameMatch` option is enabled and the pattern has a slash', () => {
            const settings = new settings_1.default({ baseNameMatch: true });
            const expected = [
                tests.task.builder().base('root').positive('root/*/file.txt').build(),
            ];
            const actual = manager.generate(['root/*/file.txt'], settings);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should add glob star to patterns when the `baseNameMatch` option is enabled and the pattern does not have a slash', () => {
            const settings = new settings_1.default({ baseNameMatch: true });
            const expected = [
                tests.task.builder().base('.').positive('**/file.txt').build(),
            ];
            const actual = manager.generate(['file.txt'], settings);
            assert.deepStrictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.convertPatternsToTasks', () => {
        (0, mocha_1.it)('should return one task when positive patterns have a global pattern', () => {
            const expected = [
                tests.task.builder().base('.').positive('*').negative('*.md').build(),
            ];
            const actual = manager.convertPatternsToTasks(['*'], ['*.md'], /* dynamic */ true);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return two tasks when one of patterns contains reference to the parent directory', () => {
            const expected = [
                tests.task.builder().base('..').positive('../*.md').negative('*.md').build(),
                tests.task.builder().base('.').positive('*').positive('a/*').negative('*.md').build(),
            ];
            const actual = manager.convertPatternsToTasks(['*', 'a/*', '../*.md'], ['*.md'], /* dynamic */ true);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return two tasks when all patterns refers to the different base directories', () => {
            const expected = [
                tests.task.builder().base('a').positive('a/*').negative('b/*.md').build(),
                tests.task.builder().base('b').positive('b/*').negative('b/*.md').build(),
            ];
            const actual = manager.convertPatternsToTasks(['a/*', 'b/*'], ['b/*.md'], /* dynamic */ true);
            assert.deepStrictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.getPositivePatterns', () => {
        (0, mocha_1.it)('should return only positive patterns', () => {
            const expected = ['*'];
            const actual = manager.getPositivePatterns(['*', '!*.md']);
            assert.deepStrictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.getNegativePatternsAsPositive', () => {
        (0, mocha_1.it)('should return negative patterns as positive', () => {
            const expected = ['*.md'];
            const actual = manager.getNegativePatternsAsPositive(['*', '!*.md'], []);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return negative patterns as positive with patterns from ignore option', () => {
            const expected = ['*.md', '*.txt', '*.json'];
            const actual = manager.getNegativePatternsAsPositive(['*', '!*.md'], ['*.txt', '!*.json']);
            assert.deepStrictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.groupPatternsByBaseDirectory', () => {
        (0, mocha_1.it)('should return empty object', () => {
            const expected = {};
            const actual = manager.groupPatternsByBaseDirectory([]);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return grouped patterns', () => {
            const expected = {
                '.': ['*'],
                a: ['a/*'],
            };
            const actual = manager.groupPatternsByBaseDirectory(['*', 'a/*']);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should remove backslashes from the base directory', () => {
            const expected = {
                "a'b": [String.raw `a\'b/*`],
            };
            const actual = manager.groupPatternsByBaseDirectory([String.raw `a\'b/*`]);
            assert.deepStrictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.convertPatternGroupsToTasks', () => {
        (0, mocha_1.it)('should return two tasks', () => {
            const expected = [
                tests.task.builder().base('a').positive('a/*').negative('b/*.md').build(),
                tests.task.builder().base('b').positive('b/*').negative('b/*.md').build(),
            ];
            const actual = manager.convertPatternGroupsToTasks({ a: ['a/*'], b: ['b/*'] }, ['b/*.md'], /* dynamic */ true);
            assert.deepStrictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.convertPatternGroupToTask', () => {
        (0, mocha_1.it)('should return created dynamic task', () => {
            const expected = tests.task.builder().base('.').positive('*').negative('*.md').build();
            const actual = manager.convertPatternGroupToTask('.', ['*'], ['*.md'], /* dynamic */ true);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return created static task', () => {
            const expected = tests.task.builder().base('.').static().positive('.gitignore').negative('.git*').build();
            const actual = manager.convertPatternGroupToTask('.', ['.gitignore'], ['.git*'], /* dynamic */ false);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should normalize the base path', () => {
            const expected = tests.task.builder().base('root/directory').build();
            const actual = manager.convertPatternGroupToTask('root/directory', [], [], /* dynamic */ true);
            assert.deepStrictEqual(actual, expected);
        });
    });
});
