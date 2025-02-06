"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = builder;
class TaskBuilder {
    #task = {
        base: '',
        dynamic: true,
        patterns: [],
        positive: [],
        negative: [],
    };
    base(base) {
        this.#task.base = base;
        return this;
    }
    static() {
        this.#task.dynamic = false;
        return this;
    }
    positive(pattern) {
        this.#task.patterns.push(pattern);
        this.#task.positive.push(pattern);
        return this;
    }
    negative(pattern) {
        this.#task.patterns.push(`!${pattern}`);
        this.#task.negative.push(pattern);
        return this;
    }
    build() {
        return this.#task;
    }
}
function builder() {
    return new TaskBuilder();
}
