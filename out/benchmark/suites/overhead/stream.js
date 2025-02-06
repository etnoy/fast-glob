"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("node:path");
const bencho = require("bencho");
const utils = require("../../utils");
class Glob {
    #cwd;
    #pattern;
    constructor(cwd, pattern) {
        this.#cwd = cwd;
        this.#pattern = pattern;
    }
    async measureFastGlob() {
        const glob = await utils.importAndMeasure(utils.importCurrentFastGlob);
        const entries = [];
        const stream = glob.globStream(this.#pattern, {
            cwd: this.#cwd,
            unique: false,
            onlyFiles: false,
            followSymbolicLinks: false,
        });
        const action = new Promise((resolve, reject) => {
            stream.once('error', (error) => {
                reject(error);
            });
            stream.on('data', (entry) => entries.push(entry));
            stream.once('end', () => {
                resolve(entries);
            });
        });
        await this.#measure(() => action);
    }
    async measureFsWalk() {
        const fsWalk = await utils.importAndMeasure(() => Promise.resolve().then(() => require('@nodelib/fs.walk')));
        const settings = new fsWalk.Settings({
            deepFilter: (entry) => this.#pattern !== '*' && !entry.name.startsWith('.'),
            entryFilter: (entry) => !entry.name.startsWith('.'),
        });
        const entries = [];
        const stream = fsWalk.walkStream(this.#cwd, settings);
        const action = new Promise((resolve, reject) => {
            stream.once('error', (error) => {
                reject(error);
            });
            stream.on('data', (entry) => entries.push(entry));
            stream.once('end', () => {
                resolve(entries);
            });
        });
        await this.#measure(() => action);
    }
    async #measure(function_) {
        const timeStart = utils.timeStart();
        const matches = await function_();
        const count = matches.length;
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
    if (!['*', '**'].includes(pattern)) {
        throw new TypeError('Unknown pattern.');
    }
    const glob = new Glob(cwd, pattern);
    switch (impl) {
        case 'fast-glob': {
            await glob.measureFastGlob();
            break;
        }
        case 'fs-walk': {
            await glob.measureFsWalk();
            break;
        }
        default: {
            throw new TypeError('Unknown implementation.');
        }
    }
})();
