"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
const fs = require("node:fs");
exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: fs.lstat,
    lstatSync: fs.lstatSync,
    stat: fs.stat,
    statSync: fs.statSync,
    readdir: fs.readdir,
    readdirSync: fs.readdirSync,
};
class Settings {
    absolute;
    baseNameMatch;
    braceExpansion;
    caseSensitiveMatch;
    cwd;
    deep;
    dot;
    extglob;
    followSymbolicLinks;
    fs;
    globstar;
    ignore;
    markDirectories;
    objectMode;
    onlyDirectories;
    onlyFiles;
    stats;
    suppressErrors;
    errorHandler;
    throwErrorOnBrokenSymbolicLink;
    unique;
    signal;
    // eslint-disable-next-line complexity
    constructor(options = {}) {
        this.absolute = options.absolute ?? false;
        this.baseNameMatch = options.baseNameMatch ?? false;
        this.braceExpansion = options.braceExpansion ?? true;
        this.caseSensitiveMatch = options.caseSensitiveMatch ?? true;
        this.cwd = options.cwd ?? process.cwd();
        this.deep = options.deep ?? Number.POSITIVE_INFINITY;
        this.dot = options.dot ?? false;
        this.extglob = options.extglob ?? true;
        this.followSymbolicLinks = options.followSymbolicLinks ?? true;
        this.fs = this.#getFileSystemMethods(options.fs);
        this.globstar = options.globstar ?? true;
        this.ignore = options.ignore ?? [];
        this.markDirectories = options.markDirectories ?? false;
        this.objectMode = options.objectMode ?? false;
        this.onlyDirectories = options.onlyDirectories ?? false;
        this.onlyFiles = options.onlyFiles ?? true;
        this.stats = options.stats ?? false;
        this.suppressErrors = options.suppressErrors ?? false;
        this.errorHandler = options.errorHandler ?? undefined;
        this.throwErrorOnBrokenSymbolicLink =
            options.throwErrorOnBrokenSymbolicLink ?? false;
        this.unique = options.unique ?? true;
        this.signal = options.signal;
        if (this.onlyDirectories) {
            this.onlyFiles = false;
        }
        if (this.stats) {
            this.objectMode = true;
        }
    }
    #getFileSystemMethods(methods = {}) {
        return {
            ...exports.DEFAULT_FILE_SYSTEM_ADAPTER,
            ...methods,
        };
    }
}
exports.default = Settings;
