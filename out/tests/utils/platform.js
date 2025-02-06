"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWindows = isWindows;
exports.isMacos = isMacos;
exports.isUnix = isUnix;
const os = require("node:os");
function isWindows() {
    return os.platform() === 'win32';
}
function isMacos() {
    return os.platform() === 'darwin';
}
function isUnix() {
    return os.platform() === 'linux';
}
