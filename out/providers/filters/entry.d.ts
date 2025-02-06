import type Settings from '../../settings';
import type { MicromatchOptions, EntryFilterFunction, Pattern } from '../../types';
export default class EntryFilter {
    #private;
    readonly index: Map<string, undefined>;
    constructor(settings: Settings, micromatchOptions: MicromatchOptions);
    getFilter(positive: Pattern[], negative: Pattern[]): EntryFilterFunction;
}
