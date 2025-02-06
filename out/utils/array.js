"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatFirstLevel = flatFirstLevel;
exports.splitWhen = splitWhen;
function flatFirstLevel(items) {
    // We do not use `Array.flat` because this is slower than current implementation for your case.
    return [].concat(...items);
}
function splitWhen(items, predicate) {
    const result = [[]];
    let groupIndex = 0;
    for (const item of items) {
        if (predicate(item)) {
            groupIndex++;
            result[groupIndex] = [];
        }
        else {
            result[groupIndex].push(item);
        }
    }
    return result;
}
