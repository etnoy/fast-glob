import * as fsWalk from '@nodelib/fs.walk';
import { Reader } from './reader';
import { ReaderStream } from './stream';
import type Settings from '../settings';
import type { Entry, ReaderOptions, Pattern } from '../types';
export interface IReaderAsync {
    dynamic: (root: string, options: ReaderOptions) => Promise<Entry[]>;
    static: (patterns: Pattern[], options: ReaderOptions) => Promise<Entry[]>;
}
export declare class ReaderAsync extends Reader<Promise<Entry[]>> implements IReaderAsync {
    protected _walkAsync: typeof fsWalk.walk;
    protected _readerStream: ReaderStream;
    constructor(settings: Settings);
    dynamic(root: string, options: ReaderOptions): Promise<Entry[]>;
    static(patterns: Pattern[], options: ReaderOptions): Promise<Entry[]>;
}
