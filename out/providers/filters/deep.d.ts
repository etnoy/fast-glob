import type { MicromatchOptions, EntryFilterFunction, Pattern } from '../../types';
import type Settings from '../../settings';
export default class DeepFilter {
    #private;
    constructor(settings: Settings, micromatchOptions: MicromatchOptions);
    getFilter(basePath: string, positive: Pattern[], negative: Pattern[]): EntryFilterFunction;
}
