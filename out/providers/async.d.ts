import { Provider } from './provider';
import type { IReaderAsync } from '../readers';
import type Settings from '../settings';
import type { Task } from '../managers/tasks';
import type { Entry, EntryItem, ReaderOptions } from '../types';
export declare class ProviderAsync extends Provider<Promise<EntryItem[]>> {
    #private;
    constructor(reader: IReaderAsync, settings: Settings);
    read(task: Task): Promise<EntryItem[]>;
    api(root: string, task: Task, options: ReaderOptions): Promise<Entry[]>;
}
