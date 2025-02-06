"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderStream = void 0;
const node_stream_1 = require("node:stream");
const provider_1 = require("./provider");
class ProviderStream extends provider_1.Provider {
    #reader;
    constructor(reader, settings) {
        super(settings);
        this.#reader = reader;
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new node_stream_1.Readable({ objectMode: true, read: () => { } });
        source
            .once('error', (error) => destination.emit('error', error))
            .on('data', (entry) => destination.emit('data', options.transform(entry)))
            .once('end', () => destination.emit('end'));
        destination
            .once('close', () => source.destroy());
        return destination;
    }
    api(root, task, options) {
        if (task.dynamic) {
            return this.#reader.dynamic(root, options);
        }
        return this.#reader.static(task.patterns, options);
    }
}
exports.ProviderStream = ProviderStream;
