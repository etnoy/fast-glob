"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = isString;
exports.isEmpty = isEmpty;
exports.flatHeavilyConcatenatedString = flatHeavilyConcatenatedString;
function isString(input) {
    return typeof input === 'string';
}
function isEmpty(input) {
    return input === '';
}
/**
 * Flattens the underlying C structures of a concatenated JavaScript string.
 *
 * More details: https://github.com/davidmarkclements/flatstr
 */
function flatHeavilyConcatenatedString(input) {
    // @ts-expect-error Another solution can be `.trim`, but it changes the string.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-bitwise, unicorn/prefer-math-trunc
    input | 0;
    return input;
}
