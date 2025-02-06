import type { Task } from '../../managers/tasks';
import type { Pattern } from '../../types';
declare class TaskBuilder {
    #private;
    base(base: string): this;
    static(): this;
    positive(pattern: Pattern): this;
    negative(pattern: Pattern): this;
    build(): Task;
}
export declare function builder(): TaskBuilder;
export {};
