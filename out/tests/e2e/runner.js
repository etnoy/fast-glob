"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suite = suite;
/* eslint-disable mocha/no-setup-in-describe */
const assert = require("node:assert");
const snapshotIt = require("snap-shot-it");
const mocha_1 = require("mocha");
const fg = require("../..");
const CWD = process.cwd().replaceAll('\\', '/');
function suite(name, suite) {
    (0, mocha_1.describe)(name, () => {
        for (const test of getSuiteTests(suite.tests)) {
            const title = getTestTitle(test);
            const definition = getTestMochaDefinition(suite, test);
            const transformers = getResultTransformers(suite, test);
            const patterns = getTestPatterns(test);
            const options = getFastGlobOptions(suite, test);
            definition(`${title} (sync)`, () => {
                let actual = getFastGlobEntriesSync(patterns, options);
                actual = transform(actual, transformers);
                debug(actual, suite, test);
                assertResult(actual, test);
            });
            definition(`${title} (async)`, async () => {
                let actual = await getFastGlobEntriesAsync(patterns, options);
                actual = transform(actual, transformers);
                debug(actual, suite, test);
                assertResult(actual, test);
            });
            definition(`${title} (stream)`, async () => {
                let actual = await getFastGlobEntriesStream(patterns, options);
                actual = transform(actual, transformers);
                debug(actual, suite, test);
                assertResult(actual, test);
            });
        }
    });
}
function getSuiteTests(tests) {
    return [].concat(...tests);
}
function getTestPatterns(test) {
    return [].concat(test.pattern);
}
function getTestTitle(test) {
    // Replacing placeholders to hide absolute paths from snapshots.
    const replacements = {
        cwd: test.options?.cwd?.replace(CWD, '<root>'),
        ignore: test.options?.ignore?.map((pattern) => pattern.replace(CWD, '<root>')),
    };
    return JSON.stringify({
        pattern: test.pattern,
        options: {
            ...test.options,
            ...replacements,
        },
    });
}
function getTestMochaDefinition(suite, test) {
    const isDebugDefined = suite.debug !== undefined || test.debug !== undefined;
    const isDebugEnabled = suite.debug !== false || test.debug !== false;
    if (isDebugDefined && isDebugEnabled) {
        return mocha_1.it.only;
    }
    if (suite.condition?.() === false || test.condition?.() === false) {
        return mocha_1.it.skip;
    }
    return mocha_1.it;
}
function getFastGlobOptions(suite, test) {
    let options = test.options;
    if (typeof suite.debug !== 'boolean') {
        options = { ...options, ...suite.debug };
    }
    if (typeof test.debug !== 'boolean') {
        options = { ...options, ...test.debug };
    }
    return options;
}
function getResultTransformers(suite, test) {
    const transformers = [];
    if (suite.resultTransform !== undefined) {
        transformers.push(suite.resultTransform);
    }
    if (test.resultTransform !== undefined) {
        transformers.push(test.resultTransform);
    }
    return transformers;
}
function getFastGlobEntriesSync(patterns, options) {
    return fg.globSync(patterns, options);
}
async function getFastGlobEntriesAsync(patterns, options) {
    return fg.glob(patterns, options);
}
async function getFastGlobEntriesStream(patterns, options) {
    const entries = [];
    const stream = fg.globStream(patterns, options);
    await new Promise((resolve, reject) => {
        stream.on('data', (entry) => entries.push(entry));
        stream.once('error', reject);
        stream.once('end', resolve);
    });
    return entries;
}
function transform(entries, transformers) {
    let result = entries;
    for (const transformer of transformers) {
        result = result.map((item) => transformer(item));
    }
    return result;
}
function assertResult(entries, test) {
    entries.sort((a, b) => a.localeCompare(b));
    if (test.expected === undefined) {
        snapshotIt(entries);
    }
    else {
        const expected = test.expected();
        expected.sort((a, b) => a.localeCompare(b));
        assert.deepStrictEqual(entries, expected);
    }
}
function debug(current, suite, test) {
    const isDebug = suite.debug !== undefined || test.debug !== undefined;
    if (isDebug) {
        console.dir({
            current,
            suite: { debug: suite.debug },
            test: { debug: test.debug, options: test.options },
        }, { colors: true });
    }
}
