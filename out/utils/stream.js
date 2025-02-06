"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = merge;
// https://stackoverflow.com/a/39415662
// eslint-disable-next-line @typescript-eslint/no-require-imports
const merge2 = require("merge2");
function merge(streams) {
    const mergedStream = merge2(streams);
    streams.forEach((stream) => {
        stream.once('error', (error) => mergedStream.emit('error', error));
    });
    mergedStream.once('close', () => {
        propagateCloseEventToSources(streams);
    });
    mergedStream.once('end', () => {
        propagateCloseEventToSources(streams);
    });
    return mergedStream;
}
function propagateCloseEventToSources(streams) {
    streams.forEach((stream) => stream.emit('close'));
}
