"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.segment = segment;
exports.info = info;
const utils = require("../../utils");
class PatternSegmentBuilder {
    #segment = {
        dynamic: false,
        pattern: '',
    };
    dynamic() {
        this.#segment.dynamic = true;
        return this;
    }
    pattern(pattern) {
        this.#segment.pattern = pattern;
        return this;
    }
    build(options = {}) {
        if (!this.#segment.dynamic) {
            return this.#segment;
        }
        return {
            ...this.#segment,
            patternRe: utils.pattern.makeRe(this.#segment.pattern, options),
        };
    }
}
class PatternInfoBuilder {
    #section = {
        complete: true,
        pattern: '',
        segments: [],
        sections: [],
    };
    section(...segments) {
        this.#section.sections.push(segments);
        if (this.#section.segments.length === 0) {
            this.#section.complete = true;
            this.#section.segments.push(...segments);
        }
        else {
            this.#section.complete = false;
            const globstar = segment().dynamic().pattern('**').build();
            this.#section.segments.push(globstar, ...segments);
        }
        return this;
    }
    build() {
        return {
            ...this.#section,
            pattern: this.#buildPattern(),
        };
    }
    #buildPattern() {
        return this.#section.segments.map((segment) => segment.pattern).join('/');
    }
}
function segment() {
    return new PatternSegmentBuilder();
}
function info() {
    return new PatternInfoBuilder();
}
