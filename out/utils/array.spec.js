"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const mocha_1 = require("mocha");
const util = require("./array");
(0, mocha_1.describe)('Utils → Array', () => {
    (0, mocha_1.describe)('.flatFirstLevel', () => {
        (0, mocha_1.it)('should return non-nested array', () => {
            const expected = ['a', 'b'];
            const actual = util.flatFirstLevel([['a'], ['b']]);
            assert.deepStrictEqual(actual, expected);
        });
    });
    (0, mocha_1.describe)('.splitWhen', () => {
        (0, mocha_1.it)('should return one group', () => {
            const expected = [[1, 2]];
            const actual = util.splitWhen([1, 2], () => false);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return group for each item of array', () => {
            const expected = [[], [], [], []];
            const actual = util.splitWhen([1, 2, 3], () => true);
            assert.deepStrictEqual(actual, expected);
        });
        (0, mocha_1.it)('should return two group', () => {
            const expected = [[1, 2], [4, 5]];
            const actual = util.splitWhen([1, 2, 3, 4, 5], (item) => item === 3);
            assert.deepStrictEqual(actual, expected);
        });
    });
});
