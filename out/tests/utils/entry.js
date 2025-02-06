"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = builder;
const path = require("node:path");
const fs_macchiato_1 = require("@nodelib/fs.macchiato");
class EntryBuilder {
    #entryType = fs_macchiato_1.DirentType.Unknown;
    #entry = {
        name: '',
        path: '',
        dirent: new fs_macchiato_1.Dirent(),
    };
    path(filepath) {
        this.#entry.name = path.basename(filepath);
        this.#entry.path = filepath;
        return this;
    }
    file() {
        this.#entryType = fs_macchiato_1.DirentType.File;
        return this;
    }
    directory() {
        this.#entryType = fs_macchiato_1.DirentType.Directory;
        return this;
    }
    symlink() {
        this.#entryType = fs_macchiato_1.DirentType.Link;
        return this;
    }
    socket() {
        this.#entryType = fs_macchiato_1.DirentType.Socket;
        return this;
    }
    stats() {
        this.#entry.stats = new fs_macchiato_1.Stats();
        return this;
    }
    build() {
        this.#entry.dirent = new fs_macchiato_1.Dirent(this.#entry.name, this.#entryType);
        return this.#entry;
    }
}
function builder() {
    return new EntryBuilder();
}
