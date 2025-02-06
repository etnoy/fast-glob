"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("node:path");
const bencho = require("bencho");
const utils = require("../../utils");
class Glob {
    #pattern;
    #options;
    constructor(pattern, options) {
        this.#pattern = pattern;
        this.#options = {
            unique: false,
            followSymbolicLinks: false,
            ...options,
        };
    }
    async measurePreviousVersion() {
        const glob = await utils.importAndMeasure(utils.importPreviousFastGlob);
        // @ts-expect-error remove this line after the next major release.
        await this.#measure(() => glob.globStream(this.#pattern, this.#options));
    }
    async measureCurrentVersion() {
        const glob = await utils.importAndMeasure(utils.importCurrentFastGlob);
        await this.#measure(() => glob.globStream(this.#pattern, this.#options));
    }
    async #measure(function_) {
        const entries = [];
        const timeStart = utils.timeStart();
        await new Promise((resolve, reject) => {
            const stream = function_();
            stream.once('error', (error) => {
                reject(error);
            });
            stream.on('data', (entry) => entries.push(entry));
            stream.once('end', () => {
                resolve();
            });
        });
        const count = entries.length;
        const memory = utils.getMemory();
        const time = utils.timeEnd(timeStart);
        bencho.time('time', time);
        bencho.memory('memory', memory);
        bencho.value('entries', count);
    }
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const args = process.argv.slice(2);
    const cwd = path.join(process.cwd(), args[0]);
    const pattern = args[1];
    const impl = args[2];
    const options = JSON.parse(process.env['BENCHMARK_OPTIONS'] ?? '{}');
    const glob = new Glob(pattern, {
        cwd,
        ...options,
    });
    switch (impl) {
        case 'current': {
            await glob.measureCurrentVersion();
            break;
        }
        case 'previous': {
            await glob.measurePreviousVersion();
            break;
        }
        default: {
            throw new TypeError('Unknown glob implementation.');
        }
    }
})();
