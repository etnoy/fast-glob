import type Settings from '../../settings';
import type { EntryTransformerFunction } from '../../types';
export default class EntryTransformer {
    #private;
    constructor(settings: Settings);
    getTransformer(): EntryTransformerFunction;
}
