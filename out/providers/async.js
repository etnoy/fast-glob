"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderAsync = void 0;
const provider_1 = require("./provider");
class ProviderAsync extends provider_1.Provider {
    #reader;
    constructor(reader, settings) {
        super(settings);
        this.#reader = reader;
    }
    async read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = await this.api(root, task, options);
        return entries.map((entry) => options.transform(entry));
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this.#reader.dynamic(root, options);
        }
        return this.#reader.static(task.patterns, options);
    }
}
exports.ProviderAsync = ProviderAsync;
