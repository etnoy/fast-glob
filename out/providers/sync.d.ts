import { Provider } from './provider';
import type { IReaderSync } from '../readers';
import type Settings from '../settings';
import type { Task } from '../managers/tasks';
import type { Entry, EntryItem, ReaderOptions } from '../types';
export declare class ProviderSync extends Provider<EntryItem[]> {
    #private;
    constructor(reader: IReaderSync, settings: Settings);
    read(task: Task): EntryItem[];
    api(root: string, task: Task, options: ReaderOptions): Entry[];
}
