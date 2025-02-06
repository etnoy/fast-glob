import * as fsStat from '@nodelib/fs.stat';
import * as fsWalk from '@nodelib/fs.walk';
import { Reader } from './reader';
import type { Pattern, ReaderOptions } from '../types';
import type { Readable } from 'node:stream';
export interface IReaderStream {
    dynamic: (root: string, options: ReaderOptions) => Readable;
    static: (patterns: Pattern[], options: ReaderOptions) => Readable;
}
export declare class ReaderStream extends Reader<Readable> implements IReaderStream {
    #private;
    protected _walkStream: typeof fsWalk.walkStream;
    protected _stat: typeof fsStat.stat;
    dynamic(root: string, options: ReaderOptions): Readable;
    static(patterns: Pattern[], options: ReaderOptions): Readable;
}
