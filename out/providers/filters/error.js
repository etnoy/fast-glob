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
            this.#settings.errorHandler(error);
            return true;
        }
        if (utils.errno.isEnoentCodeError(error)) {
            return true;
        }
        return false;
    }
}
exports.default = ErrorFilter;
