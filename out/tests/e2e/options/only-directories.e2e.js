"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runner = require("../runner");
runner.suite('Options OnlyDirectories', {
    tests: [
        {
            pattern: 'fixtures/*',
            options: {
                onlyDirectories: true,
            },
        },
        {
            pattern: 'fixtures/**',
            options: {
                onlyDirectories: true,
            },
        },
        {
            pattern: 'fixtures/**/*',
            options: {
                onlyDirectories: true,
            },
        },
        {
            pattern: 'fixtures/*/',
            options: {
                onlyDirectories: true,
            },
        },
        {
            pattern: 'fixtures/**/',
            options: {
                onlyDirectories: true,
            },
        },
        {
            pattern: 'fixtures/**/*/',
            options: {
                onlyDirectories: true,
            },
        },
    ],
});
runner.suite('Options OnlyDirectories (cwd)', {
    tests: [
        {
            pattern: '*',
            options: {
                cwd: 'fixtures',
                onlyDirectories: true,
            },
        },
        {
            pattern: '**',
            options: {
                cwd: 'fixtures',
                onlyDirectories: true,
            },
        },
        {
            pattern: '**/*',
            options: {
                cwd: 'fixtures',
                onlyDirectories: true,
            },
        },
        {
            pattern: '*/',
            options: {
                cwd: 'fixtures',
                onlyDirectories: true,
            },
        },
        {
            pattern: '**/',
            options: {
                cwd: 'fixtures',
                onlyDirectories: true,
            },
        },
        {
            pattern: '**/*/',
            options: {
                cwd: 'fixtures',
                onlyDirectories: true,
            },
        },
    ],
});
