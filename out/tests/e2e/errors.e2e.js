"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner = require("./runner");
runner.suite('Errors', {
    tests: [
        {
            pattern: 'non-exist-directory/**',
        },
        {
            pattern: 'non-exist-file.txt',
        },
    ],
});
runner.suite('Errors (cwd)', {
    tests: [
        {
            pattern: '**',
            options: {
                cwd: 'non-exist-directory',
            },
        },
    ],
});
