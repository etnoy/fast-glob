"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDirectory = isDirectory;
const fs = require("node:fs");
function isDirectory(filepath) {
    const stats = fs.lstatSync(filepath);
    return stats.isDirectory();
}
