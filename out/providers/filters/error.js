"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../../utils");
class ErrorFilter {
    #settings;
    constructor(settings) {
        this.#settings = settings;
    }
    getFilter() {
        return (error) => this.#isNonFatalError(error);
    }
    #isNonFatalError(error) {
        if (this.#settings.suppressErrors) {
            return true;
        }
        if (this.#settings.errorHandler !== undefined) {
            return this.#settings.errorHandler(error);
        }
        if (utils.errno.isEnoentCodeError(error)) {
            return true;
        }
        return false;
    }
}
exports.default = ErrorFilter;
