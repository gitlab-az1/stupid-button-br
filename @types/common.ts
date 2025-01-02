export type Bool = 0 | 1;

export type LooseAutocomplete<T extends string | number | symbol> = T | Omit<string, T>;

export type Dict<T> = {
  [key: string]: T;
}

export type ReadonlyDict<T> = {
  readonly [key: string]: T;
}


export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
}

export type DeepWritable<T> = {
  -readonly [P in keyof T]: DeepWritable<T[P]>;
}

export type PrimitiveDictionary = {
  [key: string]: string | number | boolean | null;
}

export type MaybePromise<T> = T | Promise<T>;

export type LooseObjectKeys<T extends object, X = T[keyof T]> = { [K in keyof T]?: T[K] } & { [key: string]: X };
