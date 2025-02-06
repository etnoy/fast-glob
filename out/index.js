"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.win32 = exports.posix = exports.convertPathToPattern = exports.escapePath = exports.stream = exports.sync = exports.async = void 0;
exports.glob = glob;
exports.globSync = globSync;
exports.globStream = globStream;
exports.generateTasks = generateTasks;
exports.isDynamicPattern = isDynamicPattern;
const taskManager = require("./managers/tasks");
const settings_1 = require("./settings");
const utils = require("./utils");
const providers_1 = require("./providers");
const readers_1 = require("./readers");
async function glob(source, options) {
    assertPatternsInput(source);
    const settings = new settings_1.default(options);
    const reader = new readers_1.ReaderAsync(settings);
    const provider = new providers_1.ProviderAsync(reader, settings);
    const tasks = getTasks(source, settings);
    const promises = tasks.map((task) => provider.read(task));
    const result = await Promise.all(promises);
    return utils.array.flatFirstLevel(result);
}
/**
 * @deprecated
 * This method will be removed in v5, use the `.glob` method instead.
 */
exports.async = glob;
function globSync(source, options) {
    assertPatternsInput(source);
    const settings = new settings_1.default(options);
    const reader = new readers_1.ReaderSync(settings);
    const provider = new providers_1.ProviderSync(reader, settings);
    const tasks = getTasks(source, settings);
    const entries = tasks.map((task) => provider.read(task));
    return utils.array.flatFirstLevel(entries);
}
/**
 * @deprecated
 * This method will be removed in v5, use the `.globSync` method instead.
 */
exports.sync = globSync;
function globStream(source, options) {
    assertPatternsInput(source);
    const settings = new settings_1.default(options);
    const reader = new readers_1.ReaderStream(settings);
    const provider = new providers_1.ProviderStream(reader, settings);
    const tasks = getTasks(source, settings);
    const streams = tasks.map((task) => provider.read(task));
    /**
     * The stream returned by the provider cannot work with an asynchronous iterator.
     * To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
     * This affects performance (+25%). I don't see best solution right now.
     */
    return utils.stream.merge(streams);
}
/**
 * @deprecated
 * This method will be removed in v5, use the `.globStream` method instead.
 */
exports.stream = globStream;
function generateTasks(source, options) {
    assertPatternsInput(source);
    const patterns = [].concat(source);
    const settings = new settings_1.default(options);
    return taskManager.generate(patterns, settings);
}
function isDynamicPattern(source, options) {
    assertPatternsInput(source);
    const settings = new settings_1.default(options);
    return utils.pattern.isDynamicPattern(source, settings);
}
exports.escapePath = withPatternsInputAssert(utils.path.escape);
exports.convertPathToPattern = withPatternsInputAssert(utils.path.convertPathToPattern);
exports.posix = {
    escapePath: withPatternsInputAssert(utils.path.escapePosixPath),
    convertPathToPattern: withPatternsInputAssert(utils.path.convertPosixPathToPattern),
};
exports.win32 = {
    escapePath: withPatternsInputAssert(utils.path.escapeWindowsPath),
    convertPathToPattern: withPatternsInputAssert(utils.path.convertWindowsPathToPattern),
};
function getTasks(source, settings) {
    const patterns = [].concat(source);
    return taskManager.generate(patterns, settings);
}
function assertPatternsInput(input) {
    const source = [].concat(input);
    const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
    if (!isValidSource) {
        throw new TypeError('Patterns must be a string (non empty) or an array of strings');
    }
}
function withPatternsInputAssert(method) {
    return (source) => {
        assertPatternsInput(source);
        return method(source);
    };
}
