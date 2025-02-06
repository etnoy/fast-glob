import * as fsStat from '@nodelib/fs.stat';
import * as fsWalk from '@nodelib/fs.walk';
import { Reader } from './reader';
import type { Entry, Pattern, ReaderOptions } from '../types';
export interface IReaderSync {
    dynamic: (root: string, options: ReaderOptions) => Entry[];
    static: (patterns: Pattern[], options: ReaderOptions) => Entry[];
}
export declare class ReaderSync extends Reader<Entry[]> implements IReaderSync {
    #private;
    protected _walkSync: typeof fsWalk.walkSync;
    protected _statSync: typeof fsStat.statSync;
    dynamic(root: string, options: ReaderOptions): Entry[];
    static(patterns: Pattern[], options: ReaderOptions): Entry[];
}
