"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const tests = require("./tests");
const fg = require(".");
// Only for validating the input data.
const invalidInputData = null;
(0, mocha_1.describe)('Package', () => {
    (0, mocha_1.describe)('.globSync', () => {
        (0, mocha_1.it)('should throw an error when input values can not pass validation', () => {
            const message = 'Patterns must be a string (non empty) or an array of strings';
            assert.throws(() => fg.globSync(invalidInputData), { message });
            assert.throws(() => fg.globSync(''), { message });
        });
        (0, mocha_1.it)('should returns entries', () => {
            const expected = [
                'fixtures/file.md',
                'fixtures/first/file.md',
                'fixtures/first/nested/directory/file.md',
                'fixtures/first/nested/file.md',
                'fixtures/second/file.md',
                'fixtures/second/nested/directory/file.md',
                'fixtures/second/nested/file.md',
                'fixtures/third/library/a/book.md',
                'fixtures/third/library/b/book.md',
            ];
            const actual = fg.globSync(['fixtures/**/*.md']);
            actual.sort((a, b) => a.localeCompare(b));
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should returns entries (two sources)', () => {
            const expected = [
                'fixtures/first/file.md',
                'fixtures/first/nested/directory/file.md',
                'fixtures/first/nested/file.md',
                'fixtures/second/file.md',
                'fixtures/second/nested/directory/file.md',
                'fixtures/second/nested/file.md',
            ];
            const actual = fg.globSync(['fixtures/first/**/*.md', 'fixtures/second/**/*.md']);
            actual.sort((a, b) => a.localeCompare(b));
            assert.deepStrictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.sync', () => {
        (0, mocha_1.it)('should be an alias for the .globSync method', () => {
            // eslint-disable-next-line import/no-deprecated, @typescript-eslint/no-deprecated
            assert.strictEqual(fg.sync, fg.globSync);
        });
    });
    (0, mocha_1.describe)('.glob', () => {
        (0, mocha_1.it)('should throw an error when input values can not pass validation', async () => {
            const message = 'Patterns must be a string (non empty) or an array of strings';
            await assert.rejects(() => fg.glob(invalidInputData), { message });
            await assert.rejects(() => fg.glob(''), { message });
        });
        (0, mocha_1.it)('should returns entries', async () => {
            const expected = [
                'fixtures/file.md',
                'fixtures/first/file.md',
                'fixtures/first/nested/directory/file.md',
                'fixtures/first/nested/file.md',
                'fixtures/second/file.md',
                'fixtures/second/nested/directory/file.md',
                'fixtures/second/nested/file.md',
                'fixtures/third/library/a/book.md',
                'fixtures/third/library/b/book.md',
            ];
            const actual = await fg.glob(['fixtures/**/*.md']);
            actual.sort((a, b) => a.localeCompare(b));
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should returns entries (two sources)', async () => {
            const expected = [
                'fixtures/first/file.md',
                'fixtures/first/nested/directory/file.md',
                'fixtures/first/nested/file.md',
                'fixtures/second/file.md',
                'fixtures/second/nested/directory/file.md',
                'fixtures/second/nested/file.md',
            ];
            const actual = await fg.glob(['fixtures/first/**/*.md', 'fixtures/second/**/*.md']);
            actual.sort((a, b) => a.localeCompare(b));
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should abort processing dynamic pattern with abort signal', async () => {
            const ac = new AbortController();
            setTimeout(() => {
                ac.abort();
            }, 5);
            // The globstar pattern is used here to make the call run longer than the settimeout.
            const action = fg.glob(['**'], { signal: ac.signal });
            await assert.rejects(() => action, { message: 'This operation was aborted' });
        });
        (0, mocha_1.it)('should abort processing static pattern with abort signal', async () => {
            const ac = new AbortController();
            ac.abort();
            const action = fg.glob(['./package.json'], { signal: ac.signal });
            await assert.rejects(() => action, { message: 'The operation was aborted' });
        });
    });
    (0, mocha_1.describe)('.async', () => {
        (0, mocha_1.it)('should be an alias for the .glob method', () => {
            // eslint-disable-next-line import/no-deprecated, @typescript-eslint/no-deprecated
            assert.strictEqual(fg.async, fg.glob);
        });
    });
    (0, mocha_1.describe)('.globStream', () => {
        (0, mocha_1.it)('should throw an error when input values can not pass validation', () => {
            const message = 'Patterns must be a string (non empty) or an array of strings';
            assert.throws(() => fg.globStream(invalidInputData), { message });
            assert.throws(() => fg.globStream(''), { message });
        });
        (0, mocha_1.it)('should returns entries', (done) => {
            const expected = [
                'fixtures/file.md',
                'fixtures/first/file.md',
                'fixtures/first/nested/directory/file.md',
                'fixtures/first/nested/file.md',
                'fixtures/second/file.md',
                'fixtures/second/nested/directory/file.md',
                'fixtures/second/nested/file.md',
                'fixtures/third/library/a/book.md',
                'fixtures/third/library/b/book.md',
            ];
            const actual = [];
            const stream = fg.globStream(['fixtures/**/*.md']);
            stream.on('data', (entry) => actual.push(entry));
            stream.once('error', (error) => assert.fail(error));
            stream.once('end', () => {
                actual.sort((a, b) => a.localeCompare(b));
                assert.deepStrictEqual(actual, expected);
                done();
            });
        });
        (0, mocha_1.it)('should returns entries (two sources)', (done) => {
            const expected = [
                'fixtures/first/file.md',
                'fixtures/first/nested/directory/file.md',
                'fixtures/first/nested/file.md',
                'fixtures/second/file.md',
                'fixtures/second/nested/directory/file.md',
                'fixtures/second/nested/file.md',
            ];
            const actual = [];
            const stream = fg.globStream(['fixtures/first/**/*.md', 'fixtures/second/**/*.md']);
            stream.on('data', (entry) => actual.push(entry));
            stream.once('error', (error) => assert.fail(error));
            stream.once('end', () => {
                actual.sort((a, b) => a.localeCompare(b));
                assert.deepStrictEqual(actual, expected);
                done();
            });
        });
        (0, mocha_1.it)('should abort processing dynamic pattern with abort signal', (done) => {
            const ac = new AbortController();
            setTimeout(() => {
                ac.abort();
            }, 5);
            // The globstar pattern is used here to make the call run longer than the settimeout.
            const steam = fg.globStream(['**'], { signal: ac.signal });
            steam.once('error', (error) => {
                assert.strictEqual(error.message, 'This operation was aborted');
                done();
            });
            steam.once('end', () => {
                assert.fail('The stream should be aborted');
            });
        });
        (0, mocha_1.it)('should abort processing static pattern with abort signal', (done) => {
            const ac = new AbortController();
            ac.abort();
            // The globstar pattern is used here to make the call run longer than the settimeout.
            const steam = fg.globStream(['./package.json'], { signal: ac.signal });
            steam.once('error', (error) => {
                assert.strictEqual(error.message, 'The operation was aborted');
                done();
            });
            steam.once('end', () => {
                assert.fail('The stream should be aborted');
            });
        });
    });
    (0, mocha_1.describe)('.stream', () => {
        (0, mocha_1.it)('should be an alias for the .globStream method', () => {
            // eslint-disable-next-line import/no-deprecated, @typescript-eslint/no-deprecated
            assert.strictEqual(fg.stream, fg.globStream);
        });
    });
    (0, mocha_1.describe)('.generateTasks', () => {
        (0, mocha_1.it)('should throw an error when input values can not pass validation', () => {
            const message = 'Patterns must be a string (non empty) or an array of strings';
            assert.throws(() => fg.generateTasks(invalidInputData), { message });
            assert.throws(() => fg.generateTasks(''), { message });
        });
        (0, mocha_1.it)('should return tasks', () => {
            const expected = [
                tests.task.builder().base('.').positive('*').build(),
            ];
            const actual = fg.generateTasks(['*']);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return tasks with negative patterns', () => {
            const expected = [
                tests.task.builder().base('.').positive('*').negative('*.txt').negative('*.md').build(),
            ];
            const actual = fg.generateTasks(['*', '!*.txt'], { ignore: ['*.md'] });
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should clean up patterns', () => {
            const expected = [
                // Clean up duplicate slashes
                tests.task.builder().base('fixtures').positive('fixtures/*').build(),
            ];
            const actual = fg.generateTasks(['fixtures//*']);
            assert.deepStrictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.isDynamicPattern', () => {
        (0, mocha_1.it)('should return true for dynamic pattern', () => {
            assert.ok(fg.isDynamicPattern('*'));
        });
        (0, mocha_1.it)('should return false for static pattern', () => {
            assert.ok(!fg.isDynamicPattern('abc'));
        });
    });
    (0, mocha_1.describe)('.escapePath', () => {
        (0, mocha_1.it)('should return escaped path', () => {
            const expected = String.raw `C:/Program Files \(x86\)`;
            const actual = fg.escapePath('C:/Program Files (x86)');
            assert.strictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.convertPathToPattern', () => {
        (0, mocha_1.it)('should return a pattern', () => {
            // In posix system \\ is a escaping character and it will be escaped before non-special characters.
            const posix = String.raw `C:\\Program Files \(x86\)\*\*\*`;
            const windows = String.raw `C:/Program Files \(x86\)/**/*`;
            const expected = tests.platform.isWindows() ? windows : posix;
            const actual = fg.convertPathToPattern(String.raw `C:\Program Files (x86)\**\*`);
            assert.strictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('posix', () => {
        (0, mocha_1.describe)('.escapePath', () => {
            (0, mocha_1.it)('should return escaped path', () => {
                const expected = String.raw `/directory/\*\*/\*`;
                const actual = fg.posix.escapePath(String.raw `/directory/*\*/*`);
                assert.strictEqual(actual, expected);
            });
        });
        (0, mocha_1.describe)('.convertPathToPattern', () => {
            (0, mocha_1.it)('should return a pattern', () => {
                const expected = String.raw `a\*.txt`;
                const actual = fg.posix.convertPathToPattern(String.raw `a\*.txt`);
                assert.strictEqual(actual, expected);
            });
        });
    });
    (0, mocha_1.describe)('win32', () => {
        (0, mocha_1.describe)('.escapePath', () => {
            (0, mocha_1.it)('should return escaped path', () => {
                const expected = String.raw `C:\Program Files \(x86\)\**\*`;
                const actual = fg.win32.escapePath(String.raw `C:\Program Files (x86)\**\*`);
                assert.strictEqual(actual, expected);
            });
        });
        (0, mocha_1.describe)('.convertPathToPattern', () => {
            (0, mocha_1.it)('should return a pattern', () => {
                const expected = String.raw `C:/Program Files \(x86\)/**/*`;
                const actual = fg.win32.convertPathToPattern(String.raw `C:\Program Files (x86)\**\*`);
                assert.strictEqual(actual, expected);
            });
        });
    });
});
