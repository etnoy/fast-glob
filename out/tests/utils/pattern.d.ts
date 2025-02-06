import type { Pattern, MicromatchOptions } from '../../types';
import type { PatternSegment, PatternInfo } from '../../providers/matchers/matcher';
declare class PatternSegmentBuilder {
    #private;
    dynamic(): this;
    pattern(pattern: Pattern): this;
    build(options?: MicromatchOptions): PatternSegment;
}
declare class PatternInfoBuilder {
    #private;
    section(...segments: PatternSegment[]): this;
    build(): PatternInfo;
}
export declare function segment(): PatternSegmentBuilder;
export declare function info(): PatternInfoBuilder;
export {};
