"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
const path = require("node:path");
const deep_1 = require("./filters/deep");
const entry_1 = require("./filters/entry");
const error_1 = require("./filters/error");
const entry_2 = require("./transformers/entry");
class Provider {
    errorFilter;
    entryFilter;
    deepFilter;
    entryTransformer;
    #settings;
    constructor(settings) {
        this.#settings = settings;
        const micromatchOptions = this._getMicromatchOptions();
        this.errorFilter = new error_1.default(settings);
        this.entryFilter = new entry_1.default(settings, micromatchOptions);
        this.deepFilter = new deep_1.default(settings, micromatchOptions);
        this.entryTransformer = new entry_2.default(settings);
    }
    _getRootDirectory(task) {
        return path.resolve(this.#settings.cwd, task.base);
    }
    _getReaderOptions(task) {
        const basePath = task.base === '.' ? '' : task.base;
        return {
            basePath,
            pathSegmentSeparator: '/',
            deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
            entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
            errorFilter: this.errorFilter.getFilter(),
            followSymbolicLinks: this.#settings.followSymbolicLinks,
            fs: this.#settings.fs,
            stats: this.#settings.stats,
            throwErrorOnBrokenSymbolicLink: this.#settings.throwErrorOnBrokenSymbolicLink,
            transform: this.entryTransformer.getTransformer(),
            signal: this.#settings.signal,
        };
    }
    _getMicromatchOptions() {
        return {
            dot: this.#settings.dot,
            matchBase: this.#settings.baseNameMatch,
            nobrace: !this.#settings.braceExpansion,
            nocase: !this.#settings.caseSensitiveMatch,
            noext: !this.#settings.extglob,
            noglobstar: !this.#settings.globstar,
            posix: true,
            strictSlashes: false,
        };
    }
}
exports.Provider = Provider;
