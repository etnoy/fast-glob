import type { Entry } from '../../types';
declare class EntryBuilder {
    #private;
    path(filepath: string): this;
    file(): this;
    directory(): this;
    symlink(): this;
    socket(): this;
    stats(): this;
    build(): Entry;
}
export declare function builder(): EntryBuilder;
export {};
