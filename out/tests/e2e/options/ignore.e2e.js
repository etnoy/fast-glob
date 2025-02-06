"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner = require("../runner");
runner.suite('Options Ignore', {
    tests: [
        {
            pattern: 'fixtures/**/*',
            options: {
                ignore: ['**/*.md'],
            },
        },
        {
            pattern: 'fixtures/**/*',
            options: {
                ignore: ['!**/*.md'],
            },
        },
    ],
});
