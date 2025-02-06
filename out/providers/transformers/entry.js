"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("node:path");
const utils = require("../../utils");
class EntryTransformer {
    #settings;
    #pathSeparatorSymbol;
    constructor(settings) {
        this.#settings = settings;
        this.#pathSeparatorSymbol = this.#getPathSeparatorSymbol();
    }
    getTransformer() {
        return (entry) => this.#transform(entry);
    }
    #transform(entry) {
        let filepath = entry.path;
        if (this.#settings.absolute) {
            filepath = utils.path.makeAbsolute(this.#settings.cwd, filepath);
            filepath = utils.string.flatHeavilyConcatenatedString(filepath);
        }
        if (this.#settings.markDirectories && entry.dirent.isDirectory()) {
            filepath += this.#pathSeparatorSymbol;
        }
        if (!this.#settings.objectMode) {
            return filepath;
        }
        return {
            ...entry,
            path: filepath,
        };
    }
    #getPathSeparatorSymbol() {
        return this.#settings.absolute ? path.sep : '/';
    }
}
exports.default = EntryTransformer;
