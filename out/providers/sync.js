"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderSync = void 0;
const provider_1 = require("./provider");
class ProviderSync extends provider_1.Provider {
    #reader;
    constructor(reader, settings) {
        super(settings);
        this.#reader = reader;
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map((entry) => options.transform(entry));
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this.#reader.dynamic(root, options);
        }
        return this.#reader.static(task.patterns, options);
    }
}
exports.ProviderSync = ProviderSync;
