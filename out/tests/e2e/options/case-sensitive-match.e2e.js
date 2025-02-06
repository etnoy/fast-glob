"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner = require("../runner");
const utils = require("../..");
runner.suite('Options CaseSensitiveMatch', {
    tests: [
        {
            pattern: 'fixtures/File.md',
            expected: () => utils.platform.isUnix() ? [] : ['fixtures/File.md'],
        },
        {
            pattern: 'fixtures/File.md',
            options: { caseSensitiveMatch: false },
        },
    ],
});
