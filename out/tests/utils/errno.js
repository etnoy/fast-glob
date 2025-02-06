"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnoent = getEnoent;
exports.getEperm = getEperm;
exports.getEacces = getEacces;
class SystemError extends Error {
    code;
    constructor(code, message) {
        super(`${code}: ${message}`);
        this.code = code;
        this.name = 'SystemError';
    }
}
function getEnoent() {
    return new SystemError('ENOENT', 'no such file or directory');
}
function getEperm() {
    return new SystemError('EPERM', 'operation not permitted');
}
function getEacces() {
    return new SystemError('EACCES', 'permission denied');
}
