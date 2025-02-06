"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("node:assert");
const stream = require("node:stream");
const mocha_1 = require("mocha");
const util = require("./stream");
(0, mocha_1.describe)('Utils → Stream', () => {
    (0, mocha_1.describe)('.merge', () => {
        (0, mocha_1.it)('should merge two streams into one stream', () => {
            const first = new stream.PassThrough();
            const second = new stream.PassThrough();
            const expected = 3;
            const mergedStream = util.merge([first, second]);
            const actual = mergedStream.listenerCount('close');
            assert.strictEqual(actual, expected);
        });
        (0, mocha_1.it)('should propagate errors into merged stream', (done) => {
            const first = new stream.PassThrough();
            const second = new stream.PassThrough();
            const expected = [1, 2, 3];
            const mergedStream = util.merge([first, second]);
            const actual = [];
            mergedStream.on('error', (error) => actual.push(error));
            mergedStream.once('finish', () => {
                assert.deepStrictEqual(actual, expected);
                done();
            });
            first.emit('error', 1);
            second.emit('error', 2);
            mergedStream.emit('error', 3);
        });
        (0, mocha_1.it)('should propagate close event to source streams', (done) => {
            const first = new stream.PassThrough();
            const second = new stream.PassThrough();
            const mergedStream = util.merge([first, second]);
            const expected = [1, 2];
            const actual = [];
            first.once('close', () => actual.push(1));
            second.once('close', () => actual.push(2));
            mergedStream.once('finish', () => {
                assert.deepStrictEqual(actual, expected);
                done();
            });
            mergedStream.emit('close');
        });
    });
});
