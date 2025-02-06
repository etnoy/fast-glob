"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeStart = timeStart;
exports.timeEnd = timeEnd;
exports.getMemory = getMemory;
exports.importCurrentFastGlob = importCurrentFastGlob;
exports.importPreviousFastGlob = importPreviousFastGlob;
exports.importNodeGlob = importNodeGlob;
exports.importTinyGlobby = importTinyGlobby;
exports.importAndMeasure = importAndMeasure;
const node_perf_hooks_1 = require("node:perf_hooks");
const bencho = require("bencho");
function timeStart() {
    return node_perf_hooks_1.performance.now();
}
function timeEnd(start) {
    return node_perf_hooks_1.performance.now() - start;
}
function getMemory() {
    return process.memoryUsage().heapUsed;
}
function importCurrentFastGlob() {
    return Promise.resolve().then(() => require('..'));
}
function importPreviousFastGlob() {
    return Promise.resolve().then(() => require('fast-glob'));
}
function importNodeGlob() {
    return Promise.resolve().then(() => require('glob'));
}
function importTinyGlobby() {
    return Promise.resolve().then(() => require('tinyglobby'));
}
async function importAndMeasure(function_) {
    const start = timeStart();
    const result = await function_();
    const time = timeEnd(start);
    bencho.time('import.time', time);
    return result;
}
