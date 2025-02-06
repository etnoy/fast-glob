"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const path = require("node:path");
const mocha_1 = require("mocha");
const util = require("./path");
(0, mocha_1.describe)('Utils → Path', () => {
    (0, mocha_1.describe)('.makeAbsolute', () => {
        (0, mocha_1.it)('should return absolute filepath', () => {
            const expected = path.join(process.cwd(), 'file.md');
            const actual = util.makeAbsolute(process.cwd(), 'file.md');
            assert.strictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.escape', () => {
        (0, mocha_1.it)('should return pattern without additional escape characters', () => {
            assert.strictEqual(util.escape(String.raw `\!abc`), String.raw `\!abc`);
            assert.strictEqual(util.escape(String.raw `\*`), String.raw `\*`);
            assert.strictEqual(util.escape(String.raw `\!\(`), String.raw `\!\(`);
        });
        (0, mocha_1.it)('should return pattern without escape characters', () => {
            assert.strictEqual(util.escape('abc!'), 'abc!');
            assert.strictEqual(util.escape('abc/!abc'), 'abc/!abc');
            assert.strictEqual(util.escape('+abc'), '+abc');
            assert.strictEqual(util.escape('abc+'), 'abc+');
            assert.strictEqual(util.escape('@abc'), '@abc');
            assert.strictEqual(util.escape('abc@'), 'abc@');
        });
    });
    (0, mocha_1.describe)('.escapePosixPattern', () => {
        (0, mocha_1.it)('should return pattern with escaped glob symbols', () => {
            assert.strictEqual(util.escapePosixPath('!abc'), String.raw `\!abc`);
            assert.strictEqual(util.escapePosixPath('*'), String.raw `\*`);
            assert.strictEqual(util.escapePosixPath('?'), String.raw `\?`);
            assert.strictEqual(util.escapePosixPath('\\'), '\\\\');
            assert.strictEqual(util.escapePosixPath('()'), String.raw `\(\)`);
            assert.strictEqual(util.escapePosixPath('{}'), String.raw `\{\}`);
            assert.strictEqual(util.escapePosixPath('[]'), String.raw `\[\]`);
            assert.strictEqual(util.escapePosixPath('@('), String.raw `\@\(`);
            assert.strictEqual(util.escapePosixPath('!('), String.raw `\!\(`);
            assert.strictEqual(util.escapePosixPath('*('), String.raw `\*\(`);
            assert.strictEqual(util.escapePosixPath('?('), String.raw `\?\(`);
            assert.strictEqual(util.escapePosixPath('+('), String.raw `\+\(`);
        });
    });
    (0, mocha_1.describe)('.escapeWindowsPattern', () => {
        (0, mocha_1.it)('should return pattern with escaped glob symbols', () => {
            assert.strictEqual(util.escapeWindowsPath('!abc'), String.raw `\!abc`);
            assert.strictEqual(util.escapeWindowsPath('()'), String.raw `\(\)`);
            assert.strictEqual(util.escapeWindowsPath('{}'), String.raw `\{\}`);
            assert.strictEqual(util.escapeWindowsPath('[]'), String.raw `\[\]`);
            assert.strictEqual(util.escapeWindowsPath('@('), String.raw `\@\(`);
            assert.strictEqual(util.escapeWindowsPath('!('), String.raw `\!\(`);
            assert.strictEqual(util.escapeWindowsPath('+('), String.raw `\+\(`);
        });
    });
    (0, mocha_1.describe)('.removeLeadingDotCharacters', () => {
        (0, mocha_1.it)('should return path without changes', () => {
            assert.strictEqual(util.removeLeadingDotSegment('../a/b'), '../a/b');
            assert.strictEqual(util.removeLeadingDotSegment('~/a/b'), '~/a/b');
            assert.strictEqual(util.removeLeadingDotSegment('/a/b'), '/a/b');
            assert.strictEqual(util.removeLeadingDotSegment('a/b'), 'a/b');
            assert.strictEqual(util.removeLeadingDotSegment(String.raw `..\a\b`), String.raw `..\a\b`);
            assert.strictEqual(util.removeLeadingDotSegment(String.raw `~\a\b`), String.raw `~\a\b`);
            assert.strictEqual(util.removeLeadingDotSegment(String.raw `\a\b`), String.raw `\a\b`);
            assert.strictEqual(util.removeLeadingDotSegment(String.raw `a\b`), String.raw `a\b`);
        });
        (0, mocha_1.it)('should return path without leading dit characters', () => {
            assert.strictEqual(util.removeLeadingDotSegment('./a/b'), 'a/b');
            assert.strictEqual(util.removeLeadingDotSegment(String.raw `.\a\b`), String.raw `a\b`);
        });
    });
    (0, mocha_1.describe)('.removeBackslashes', () => {
        (0, mocha_1.it)('should return path without backslashes', () => {
            assert.strictEqual(util.removeBackslashes(String.raw `a\b`), 'ab');
            assert.strictEqual(util.removeBackslashes(String.raw `a\\\b`), String.raw `ab`);
        });
    });
    (0, mocha_1.describe)('.convertPathToPattern', () => {
        (0, mocha_1.it)('should return a pattern', () => {
            assert.strictEqual(util.convertPathToPattern('.{directory}'), String.raw `.\{directory\}`);
        });
    });
    (0, mocha_1.describe)('.convertPosixPathToPattern', () => {
        (0, mocha_1.it)('should escape special characters', () => {
            assert.strictEqual(util.convertPosixPathToPattern(String.raw `./**\*`), String.raw `./\*\*\*`);
        });
    });
    (0, mocha_1.describe)('.convertWindowsPathToPattern', () => {
        (0, mocha_1.it)('should escape special characters', () => {
            assert.strictEqual(util.convertPosixPathToPattern('.{directory}'), String.raw `.\{directory\}`);
        });
        (0, mocha_1.it)('should do nothing with escaped glob symbols', () => {
            assert.strictEqual(util.convertWindowsPathToPattern('\\!\\'), String.raw `\!/`);
            assert.strictEqual(util.convertWindowsPathToPattern('\\+\\'), String.raw `\+/`);
            assert.strictEqual(util.convertWindowsPathToPattern('\\@\\'), String.raw `\@/`);
            assert.strictEqual(util.convertWindowsPathToPattern('\\(\\'), String.raw `\(/`);
            assert.strictEqual(util.convertWindowsPathToPattern('\\)\\'), String.raw `\)/`);
            assert.strictEqual(util.convertWindowsPathToPattern('\\{\\'), String.raw `\{/`);
            assert.strictEqual(util.convertWindowsPathToPattern('\\}\\'), String.raw `\}/`);
            assert.strictEqual(util.convertWindowsPathToPattern('\\[\\'), String.raw `\[/`);
            assert.strictEqual(util.convertWindowsPathToPattern('\\]\\'), String.raw `\]/`);
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `.\*`), './*');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `.\**`), './**');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `.\**\*`), './**/*');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `a\{b,c\d,{b,c}}`), String.raw `a\{b,c/d,\{b,c\}\}`);
        });
        (0, mocha_1.it)('should convert slashes', () => {
            assert.strictEqual(util.convertWindowsPathToPattern('/'), '/');
            assert.strictEqual(util.convertWindowsPathToPattern('\\'), '/');
            assert.strictEqual(util.convertWindowsPathToPattern('\\\\'), '//');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `\/`), '//');
            assert.strictEqual(util.convertWindowsPathToPattern('\\/\\'), '///');
        });
        (0, mocha_1.it)('should convert relative paths', () => {
            assert.strictEqual(util.convertWindowsPathToPattern('file.txt'), 'file.txt');
            assert.strictEqual(util.convertWindowsPathToPattern('./file.txt'), './file.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `.\file.txt`), './file.txt');
            assert.strictEqual(util.convertWindowsPathToPattern('../file.txt'), '../file.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `..\file.txt`), '../file.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `.\file.txt`), './file.txt');
        });
        (0, mocha_1.it)('should convert absolute paths', () => {
            assert.strictEqual(util.convertWindowsPathToPattern('/.file.txt'), '/.file.txt');
            assert.strictEqual(util.convertWindowsPathToPattern('/root/.file.txt'), '/root/.file.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `\.file.txt`), '/.file.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `\root\.file.txt`), '/root/.file.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `\root/.file.txt`), '/root/.file.txt');
        });
        (0, mocha_1.it)('should convert traditional DOS paths', () => {
            assert.strictEqual(util.convertWindowsPathToPattern('D:ShipId.txt'), 'D:ShipId.txt');
            assert.strictEqual(util.convertWindowsPathToPattern('D:/ShipId.txt'), 'D:/ShipId.txt');
            assert.strictEqual(util.convertWindowsPathToPattern('D://ShipId.txt'), 'D://ShipId.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `D:\ShipId.txt`), 'D:/ShipId.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `D:\\ShipId.txt`), 'D://ShipId.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `D:\/ShipId.txt`), 'D://ShipId.txt');
        });
        (0, mocha_1.it)('should convert UNC paths', () => {
            assert.strictEqual(util.convertWindowsPathToPattern('\\\\system07\\'), '//system07/');
            assert.strictEqual(util.convertWindowsPathToPattern('\\\\system07\\c$\\'), '//system07/c$/');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `\\Server02\Share\Foo.txt`), '//Server02/Share/Foo.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `\\127.0.0.1\c$\File.txt`), '//127.0.0.1/c$/File.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `\\.\c:\File.txt`), '//./c:/File.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `\\?\c:\File.txt`), '//?/c:/File.txt');
            assert.strictEqual(util.convertWindowsPathToPattern(String.raw `\\.\UNC\LOCALHOST\c$\File.txt`), '//./UNC/LOCALHOST/c$/File.txt');
        });
    });
});
