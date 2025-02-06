"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../../utils");
class Matcher {
    _storage = [];
    #patterns;
    #settings;
    #micromatchOptions;
    constructor(patterns, settings, micromatchOptions) {
        this.#patterns = patterns;
        this.#settings = settings;
        this.#micromatchOptions = micromatchOptions;
        this.#fillStorage();
    }
    #fillStorage() {
        for (const pattern of this.#patterns) {
            const segments = this.#getPatternSegments(pattern);
            const sections = this.#splitSegmentsIntoSections(segments);
            this._storage.push({
                complete: sections.length <= 1,
                pattern,
                segments,
                sections,
            });
        }
    }
    #getPatternSegments(pattern) {
        const parts = utils.pattern.getPatternParts(pattern, this.#micromatchOptions);
        return parts.map((part) => {
            const dynamic = utils.pattern.isDynamicPattern(part, this.#settings);
            if (!dynamic) {
                return {
                    dynamic: false,
                    pattern: part,
                };
            }
            return {
                dynamic: true,
                pattern: part,
                patternRe: utils.pattern.makeRe(part, this.#micromatchOptions),
            };
        });
    }
    #splitSegmentsIntoSections(segments) {
        return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
    }
}
exports.default = Matcher;
