import type Settings from '../../settings';
import type { ErrorFilterFunction } from '../../types';
export default class ErrorFilter {
    #private;
    constructor(settings: Settings);
    getFilter(): ErrorFilterFunction;
}
