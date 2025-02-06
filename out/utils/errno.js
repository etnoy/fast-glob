"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnoentCodeError = isEnoentCodeError;
function isEnoentCodeError(error) {
    return error.code === 'ENOENT';
}
