"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPathToPattern = exports.escape = void 0;
exports.makeAbsolute = makeAbsolute;
exports.removeLeadingDotSegment = removeLeadingDotSegment;
exports.removeBackslashes = removeBackslashes;
exports.escapeWindowsPath = escapeWindowsPath;
exports.escapePosixPath = escapePosixPath;
exports.convertWindowsPathToPattern = convertWindowsPathToPattern;
exports.convertPosixPathToPattern = convertPosixPathToPattern;
const os = require("node:os");
const path = require("node:path");
const IS_WINDOWS_PLATFORM = os.platform() === 'win32';
const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2; // ./ or .\\
/**
 * All non-escaped special characters.
 * Posix: ()*?[]{|}, !+@ before (, ! at the beginning, \\ before non-special characters.
 * Windows: (){}[], !+@ before (, ! at the beginning.
 */
const POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(?<escape>\\?)(?<symbols>[()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
const WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(?<escape>\\?)(?<symbols>[()[\]{}]|^!|[!+@](?=\())/g;
/**
 * The device path (\\.\ or \\?\).
 * https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
 */
const DOS_DEVICE_PATH_RE = /^\\\\(?<path>[.?])/;
/**
 * All backslashes except those escaping special characters.
 * Windows: !()+@{}
 * https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
 */
const WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
function makeAbsolute(cwd, filepath) {
    return path.resolve(cwd, filepath);
}
function removeLeadingDotSegment(entry) {
    // We do not use `startsWith` because this is 10x slower than current implementation for some cases.
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    if (entry.charAt(0) === '.') {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === '/' || secondCharactery === '\\') {
            return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
        }
    }
    return entry;
}
function removeBackslashes(entry) {
    return entry.replaceAll('\\', '');
}
exports.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
function escapeWindowsPath(pattern) {
    return pattern.replaceAll(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, String.raw `\$2`);
}
function escapePosixPath(pattern) {
    return pattern.replaceAll(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, String.raw `\$2`);
}
exports.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
function convertWindowsPathToPattern(filepath) {
    return escapeWindowsPath(filepath)
        .replace(DOS_DEVICE_PATH_RE, '//$1')
        .replaceAll(WINDOWS_BACKSLASHES_RE, '/');
}
function convertPosixPathToPattern(filepath) {
    return escapePosixPath(filepath);
}
