import * as fg from '../..';
import type { Pattern } from '../../types';
type TransformFunction = (entry: string) => string;
interface Suite {
    tests: Test[] | Test[][];
    /**
     * Allow to run only one test case with debug information.
     */
    debug?: boolean | fg.Options;
    /**
     * The ability to conditionally run the test.
     */
    condition?: () => boolean;
    resultTransform?: TransformFunction;
}
interface Test {
    pattern: Pattern | Pattern[];
    options?: fg.Options;
    /**
     * Allow to run only one test case with debug information.
     */
    debug?: boolean | fg.Options;
    /**
     * The ability to conditionally run the test.
     */
    condition?: () => boolean;
    resultTransform?: TransformFunction;
    /**
     * The issue related to this test.
     */
    issue?: number | number[];
    expected?: () => string[];
}
export declare function suite(name: string, suite: Suite): void;
export {};
