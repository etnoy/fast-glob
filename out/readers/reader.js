"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reader = void 0;
const path = require("node:path");
const fsStat = require("@nodelib/fs.stat");
const utils = require("../utils");
class Reader {
    _fsStatSettings;
    #settings;
    constructor(settings) {
        this.#settings = settings;
        this._fsStatSettings = new fsStat.Settings({
            followSymbolicLink: settings.followSymbolicLinks,
            fs: settings.fs,
            throwErrorOnBrokenSymbolicLink: settings.throwErrorOnBrokenSymbolicLink,
        });
    }
    _getFullEntryPath(filepath) {
        return path.resolve(this.#settings.cwd, filepath);
    }
    _makeEntry(stats, pattern) {
        const entry = {
            name: pattern,
            path: pattern,
            dirent: utils.fs.createDirentFromStats(pattern, stats),
        };
        if (this.#settings.stats) {
            entry.stats = stats;
        }
        return entry;
    }
    _isFatalError(error) {
        if (this.#settings.suppressErrors) {
            return false;
        }
        if (this.#settings.errorHandler !== undefined) {
            return !this.#settings.errorHandler(error);
        }
        if (utils.errno.isEnoentCodeError(error)) {
            return false;
        }
        return true;
    }
}
exports.Reader = Reader;
