export declare function exclude<T, Key extends keyof T>(item: T, ...keys: Key[]): Omit<T, Key>;
