"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderSync = void 0;
const fsStat = require("@nodelib/fs.stat");
const fsWalk = require("@nodelib/fs.walk");
const reader_1 = require("./reader");
class ReaderSync extends reader_1.Reader {
    _walkSync = fsWalk.walkSync;
    _statSync = fsStat.statSync;
    dynamic(root, options) {
        return this._walkSync(root, options);
    }
    static(patterns, options) {
        const entries = [];
        for (const pattern of patterns) {
            const filepath = this._getFullEntryPath(pattern);
            const entry = this.#getEntry(filepath, pattern, options);
            if (entry === null || !options.entryFilter(entry)) {
                continue;
            }
            entries.push(entry);
        }
        return entries;
    }
    #getEntry(filepath, pattern, options) {
        try {
            const stats = this.#getStat(filepath);
            return this._makeEntry(stats, pattern);
        }
        catch (error) {
            if (options.errorFilter(error)) {
                return null;
            }
            throw error;
        }
    }
    #getStat(filepath) {
        return this._statSync(filepath, this._fsStatSettings);
    }
}
exports.ReaderSync = ReaderSync;
