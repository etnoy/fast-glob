import DeepFilter from './filters/deep';
import EntryFilter from './filters/entry';
import ErrorFilter from './filters/error';
import EntryTransformer from './transformers/entry';
import type Settings from '../settings';
import type { MicromatchOptions, ReaderOptions } from '../types';
import type { Task } from '../managers/tasks';
export declare abstract class Provider<T> {
    #private;
    readonly errorFilter: ErrorFilter;
    readonly entryFilter: EntryFilter;
    readonly deepFilter: DeepFilter;
    readonly entryTransformer: EntryTransformer;
    constructor(settings: Settings);
    abstract read(_task: Task): T;
    protected _getRootDirectory(task: Task): string;
    protected _getReaderOptions(task: Task): ReaderOptions;
    protected _getMicromatchOptions(): MicromatchOptions;
}
