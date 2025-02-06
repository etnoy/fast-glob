"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner = require("../runner");
runner.suite('Options MarkDirectories', {
    tests: [
        {
            pattern: 'fixtures/**/*',
            options: {
                markDirectories: true,
            },
        },
    ],
});
