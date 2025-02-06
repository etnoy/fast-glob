"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderStream = void 0;
const node_stream_1 = require("node:stream");
const fsStat = require("@nodelib/fs.stat");
const fsWalk = require("@nodelib/fs.walk");
const reader_1 = require("./reader");
class ReaderStream extends reader_1.Reader {
    _walkStream = fsWalk.walkStream;
    _stat = fsStat.stat;
    dynamic(root, options) {
        return this._walkStream(root, options);
    }
    static(patterns, options) {
        const filepaths = patterns.map((pattern) => this._getFullEntryPath(pattern));
        const stream = new node_stream_1.PassThrough({ objectMode: true, signal: options.signal });
        stream._write = (index, _enc, done) => {
            this.#getEntry(filepaths[index], patterns[index], options)
                .then((entry) => {
                if (entry !== null && options.entryFilter(entry)) {
                    stream.push(entry);
                }
                if (index === filepaths.length - 1) {
                    stream.end();
                }
                done();
            })
                .catch(done);
        };
        for (let index = 0; index < filepaths.length; index++) {
            stream.write(index);
        }
        return stream;
    }
    #getEntry(filepath, pattern, options) {
        return this.#getStat(filepath)
            .then((stats) => this._makeEntry(stats, pattern))
            .catch((error) => {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        });
    }
    #getStat(filepath) {
        return new Promise((resolve, reject) => {
            this._stat(filepath, this._fsStatSettings, (error, stats) => {
                if (error === null) {
                    resolve(stats);
                }
                else {
                    reject(error);
                }
            });
        });
    }
}
exports.ReaderStream = ReaderStream;
