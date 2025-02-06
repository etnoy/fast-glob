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
    async measureNodeGlob() {
        const glob = await utils.importAndMeasure(utils.importNodeGlob);
        this.#measure(() => glob.globSync(this.#pattern, {
            cwd: this.#cwd,
            nodir: true,
        }));
    }
    async measureFastGlob() {
        const glob = await utils.importAndMeasure(utils.importCurrentFastGlob);
        this.#measure(() => glob.globSync(this.#pattern, {
            cwd: this.#cwd,
            unique: false,
            followSymbolicLinks: false,
        }));
    }
    async measureTinyGlobby() {
        const tinyglobby = await utils.importAndMeasure(utils.importTinyGlobby);
        this.#measure(() => tinyglobby.globSync(this.#pattern, {
            cwd: this.#cwd,
            followSymbolicLinks: false,
        }));
    }
    #measure(function_) {
        const timeStart = utils.timeStart();
        const matches = function_();
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
    const glob = new Glob(cwd, pattern);
    switch (impl) {
        case 'node-glob': {
            await glob.measureNodeGlob();
            break;
        }
        case 'fast-glob': {
            await glob.measureFastGlob();
            break;
        }
        case 'tinyglobby': {
            await glob.measureTinyGlobby();
            break;
        }
        default: {
            throw new TypeError('Unknown glob implementation.');
        }
    }
})();
