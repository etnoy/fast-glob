"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStaticPattern = isStaticPattern;
exports.isDynamicPattern = isDynamicPattern;
exports.convertToPositivePattern = convertToPositivePattern;
exports.convertToNegativePattern = convertToNegativePattern;
exports.isNegativePattern = isNegativePattern;
exports.isPositivePattern = isPositivePattern;
exports.getNegativePatterns = getNegativePatterns;
exports.getPositivePatterns = getPositivePatterns;
exports.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
exports.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
exports.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
exports.getBaseDirectory = getBaseDirectory;
exports.hasGlobStar = hasGlobStar;
exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
exports.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
exports.expandBraceExpansion = expandBraceExpansion;
exports.getPatternParts = getPatternParts;
exports.makeRe = makeRe;
exports.convertPatternsToRe = convertPatternsToRe;
exports.matchAny = matchAny;
exports.removeDuplicateSlashes = removeDuplicateSlashes;
exports.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
exports.isAbsolute = isAbsolute;
const path = require("node:path");
// https://stackoverflow.com/a/39415662
// eslint-disable-next-line @typescript-eslint/no-require-imports
const globParent = require("glob-parent");
const micromatch = require("micromatch");
const GLOBSTAR = '**';
const ESCAPE_SYMBOL = '\\';
const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
const BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
/**
 * Matches a sequence of two or more consecutive slashes, excluding the first two slashes at the beginning of the string.
 * The latter is due to the presence of the device path at the beginning of the UNC path.
 */
const DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
function isStaticPattern(pattern, options = {}) {
    return !isDynamicPattern(pattern, options);
}
function isDynamicPattern(pattern, options = {}) {
    /**
     * A special case with an empty string is necessary for matching patterns that start with a forward slash.
     * An empty string cannot be a dynamic pattern.
     * For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
     */
    if (pattern === '') {
        return false;
    }
    /**
     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
     * filepath directly (without read directory).
     */
    if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
        return true;
    }
    if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
        return true;
    }
    if (options.braceExpansion !== false && hasBraceExpansion(pattern)) {
        return true;
    }
    return false;
}
function hasBraceExpansion(pattern) {
    const openingBraceIndex = pattern.indexOf('{');
    if (openingBraceIndex === -1) {
        return false;
    }
    const closingBraceIndex = pattern.indexOf('}', openingBraceIndex + 1);
    if (closingBraceIndex === -1) {
        return false;
    }
    const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
    return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
}
function convertToPositivePattern(pattern) {
    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
}
function convertToNegativePattern(pattern) {
    return `!${pattern}`;
}
function isNegativePattern(pattern) {
    return pattern.startsWith('!') && pattern[1] !== '(';
}
function isPositivePattern(pattern) {
    return !isNegativePattern(pattern);
}
function getNegativePatterns(patterns) {
    return patterns.filter((pattern) => isNegativePattern(pattern));
}
function getPositivePatterns(patterns) {
    return patterns.filter((pattern) => isPositivePattern(pattern));
}
/**
 * Returns patterns that can be applied inside the current directory.
 *
 * @example
 * // ['./*', '*', 'a/*']
 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
 */
function getPatternsInsideCurrentDirectory(patterns) {
    return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
}
/**
 * Returns patterns to be expanded relative to (outside) the current directory.
 *
 * @example
 * // ['../*', './../*']
 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
 */
function getPatternsOutsideCurrentDirectory(patterns) {
    return patterns.filter((pattern) => isPatternRelatedToParentDirectory(pattern));
}
function isPatternRelatedToParentDirectory(pattern) {
    return pattern.startsWith('..') || pattern.startsWith('./..');
}
function getBaseDirectory(pattern) {
    return globParent(pattern, { flipBackslashes: false });
}
function hasGlobStar(pattern) {
    return pattern.includes(GLOBSTAR);
}
function endsWithSlashGlobStar(pattern) {
    return pattern.endsWith(`/${GLOBSTAR}`);
}
function isAffectDepthOfReadingPattern(pattern) {
    const basename = path.basename(pattern);
    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
}
function expandPatternsWithBraceExpansion(patterns) {
    return patterns.reduce((collection, pattern) => {
        return collection.concat(expandBraceExpansion(pattern));
    }, []);
}
function expandBraceExpansion(pattern) {
    const patterns = micromatch.braces(pattern, { expand: true, nodupes: true, keepEscaping: true });
    /**
     * Sort the patterns by length so that the same depth patterns are processed side by side.
     * `a/{b,}/{c,}/*` – `['a///*', 'a/b//*', 'a//c/*', 'a/b/c/*']`
     */
    patterns.sort((a, b) => a.length - b.length);
    /**
     * Micromatch can return an empty string in the case of patterns like `{a,}`.
     */
    return patterns.filter((pattern) => pattern !== '');
}
function getPatternParts(pattern, options) {
    let { parts } = micromatch.scan(pattern, {
        ...options,
        parts: true,
    });
    /**
     * The scan method returns an empty array in some cases.
     * See micromatch/picomatch#58 for more details.
     */
    if (parts.length === 0) {
        parts = [pattern];
    }
    /**
     * The scan method does not return an empty part for the pattern with a forward slash.
     * This is another part of micromatch/picomatch#58.
     */
    if (parts[0].startsWith('/')) {
        parts[0] = parts[0].slice(1);
        parts.unshift('');
    }
    return parts;
}
function makeRe(pattern, options) {
    return micromatch.makeRe(pattern, options);
}
function convertPatternsToRe(patterns, options) {
    return patterns.map((pattern) => makeRe(pattern, options));
}
function matchAny(entry, patternsRe) {
    return patternsRe.some((patternRe) => patternRe.test(entry));
}
/**
 * This package only works with forward slashes as a path separator.
 * Because of this, we cannot use the standard `path.normalize` method, because on Windows platform it will use of backslashes.
 */
function removeDuplicateSlashes(pattern) {
    return pattern.replaceAll(DOUBLE_SLASH_RE, '/');
}
function partitionAbsoluteAndRelative(patterns) {
    const absolute = [];
    const relative = [];
    for (const pattern of patterns) {
        if (isAbsolute(pattern)) {
            absolute.push(pattern);
        }
        else {
            relative.push(pattern);
        }
    }
    return [absolute, relative];
}
function isAbsolute(pattern) {
    return path.isAbsolute(pattern);
}
