"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderAsync = void 0;
const fsWalk = require("@nodelib/fs.walk");
const reader_1 = require("./reader");
const stream_1 = require("./stream");
class ReaderAsync extends reader_1.Reader {
    _walkAsync = fsWalk.walk;
    _readerStream;
    constructor(settings) {
        super(settings);
        this._readerStream = new stream_1.ReaderStream(settings);
    }
    dynamic(root, options) {
        return new Promise((resolve, reject) => {
            this._walkAsync(root, options, (error, entries) => {
                if (error === null) {
                    resolve(entries);
                }
                else {
                    reject(error);
                }
            });
        });
    }
    async static(patterns, options) {
        const entries = [];
        for await (const entry of this._readerStream.static(patterns, options)) {
            entries.push(entry);
        }
        return entries;
    }
}
exports.ReaderAsync = ReaderAsync;
