"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner = require("../runner");
runner.suite('Options MatchBase', {
    tests: [
        {
            pattern: 'file.md',
            options: {
                cwd: 'fixtures',
                baseNameMatch: true,
            },
        },
        {
            pattern: 'first/*/file.md',
            options: {
                cwd: 'fixtures',
                baseNameMatch: true,
            },
        },
        {
            pattern: 'first/**/file.md',
            options: {
                cwd: 'fixtures',
                baseNameMatch: true,
            },
        },
    ],
});
