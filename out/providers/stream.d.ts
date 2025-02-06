import { Readable } from 'node:stream';
import { Provider } from './provider';
import type { IReaderStream } from '../readers';
import type Settings from '../settings';
import type { Task } from '../managers/tasks';
import type { ReaderOptions } from '../types';
export declare class ProviderStream extends Provider<Readable> {
    #private;
    constructor(reader: IReaderStream, settings: Settings);
    read(task: Task): Readable;
    api(root: string, task: Task, options: ReaderOptions): Readable;
}
