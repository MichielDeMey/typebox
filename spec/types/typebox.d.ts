export declare const Kind: unique symbol;
export declare const Modifier: unique symbol;
export declare type TModifier = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>;
export declare type TReadonlyOptional<T extends TSchema> = T & {
    [Modifier]: 'ReadonlyOptionalModifier';
};
export declare type TOptional<T extends TSchema> = T & {
    [Modifier]: 'OptionalModifier';
};
export declare type TReadonly<T extends TSchema> = T & {
    [Modifier]: 'ReadonlyModifier';
};
export interface CustomOptions {
    $id?: string;
    title?: string;
    description?: string;
    default?: any;
    examples?: any;
    [prop: string]: any;
}
export declare type StringFormatOption = 'date-time' | 'time' | 'date' | 'email' | 'idn-email' | 'hostname' | 'idn-hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uri-reference' | 'iri' | 'uuid' | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer' | 'regex';
export declare type StringOptions<TFormat extends string> = {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: TFormat;
    contentEncoding?: '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64';
    contentMediaType?: string;
} & CustomOptions;
export declare type ArrayOptions = {
    uniqueItems?: boolean;
    minItems?: number;
    maxItems?: number;
} & CustomOptions;
export declare type NumberOptions = {
    exclusiveMaximum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    minimum?: number;
    multipleOf?: number;
} & CustomOptions;
export declare type IntersectOptions = {
    unevaluatedProperties?: boolean;
} & CustomOptions;
export declare type ObjectOptions = {
    additionalProperties?: boolean;
} & CustomOptions;
export declare type TDefinitions = {
    [key: string]: TSchema;
};
export declare type TNamespace<T extends TDefinitions> = {
    [Kind]: 'NamespaceKind';
    $defs: T;
} & CustomOptions;
export interface TSchema {
    $static: unknown;
}
export declare type TEnumType = Record<string, string | number>;
export declare type TKey = string | number | symbol;
export declare type TValue = string | number | boolean;
export declare type TRecordKey = TString | TNumber | TKeyOf<any> | TUnion<any>;
export declare type TEnumKey<T = TKey> = {
    type: 'number' | 'string';
    const: T;
};
export interface TProperties {
    [key: string]: TSchema;
}
export interface TRecord<K extends TRecordKey, T extends TSchema> extends TSchema, ObjectOptions {
    $static: StaticRecord<K, T>;
    [Kind]: 'RecordKind';
    type: 'object';
    patternProperties: {
        [pattern: string]: T;
    };
}
export interface TTuple<T extends TSchema[]> extends TSchema, CustomOptions {
    $static: StaticTuple<T>;
    [Kind]: 'TupleKind';
    type: 'array';
    items?: T;
    additionalItems?: false;
    minItems: number;
    maxItems: number;
}
export interface TObject<T extends TProperties> extends TSchema, ObjectOptions {
    $static: StaticObject<T>;
    [Kind]: 'ObjectKind';
    type: 'object';
    properties: T;
    required?: string[];
}
export interface TUnion<T extends TSchema[]> extends TSchema, CustomOptions {
    $static: StaticUnion<T>;
    [Kind]: 'UnionKind';
    anyOf: T;
}
export interface TIntersect<T extends TSchema[]> extends TSchema, IntersectOptions {
    $static: StaticIntersect<T>;
    [Kind]: 'IntersectKind';
    type: 'object';
    allOf: T;
}
export interface TKeyOf<T extends TKey[]> extends TSchema, CustomOptions {
    $static: StaticKeyOf<T>;
    [Kind]: 'KeyOfKind';
    type: 'string';
    enum: T;
}
export interface TArray<T extends TSchema> extends TSchema, ArrayOptions {
    $static: StaticArray<T>;
    [Kind]: 'ArrayKind';
    type: 'array';
    items: T;
}
export interface TLiteral<T extends TValue> extends TSchema, CustomOptions {
    $static: StaticLiteral<T>;
    [Kind]: 'LiteralKind';
    const: T;
}
export interface TEnum<T extends TEnumKey[]> extends TSchema, CustomOptions {
    $static: StaticEnum<T>;
    [Kind]: 'EnumKind';
    anyOf: T;
}
export interface TRef<T extends TSchema> extends TSchema, CustomOptions {
    $static: Static<T>;
    [Kind]: 'RefKind';
    $ref: string;
}
export interface TString extends TSchema, StringOptions<string> {
    $static: string;
    [Kind]: 'StringKind';
    type: 'string';
}
export interface TNumber extends TSchema, NumberOptions {
    $static: number;
    [Kind]: 'NumberKind';
    type: 'number';
}
export interface TInteger extends TSchema, NumberOptions {
    $static: number;
    [Kind]: 'IntegerKind';
    type: 'integer';
}
export interface TBoolean extends TSchema, CustomOptions {
    $static: boolean;
    [Kind]: 'BooleanKind';
    type: 'boolean';
}
export interface TNull extends TSchema, CustomOptions {
    $static: null;
    [Kind]: 'NullKind';
    type: 'null';
}
export interface TUnknown extends TSchema, CustomOptions {
    $static: unknown;
    [Kind]: 'UnknownKind';
}
export interface TAny extends TSchema, CustomOptions {
    $static: any;
    [Kind]: 'AnyKind';
}
export interface TConstructor<T extends TSchema[], U extends TSchema> extends TSchema, CustomOptions {
    $static: StaticConstructor<T, U>;
    [Kind]: 'ConstructorKind';
    type: 'constructor';
    arguments: TSchema[];
    returns: TSchema;
}
export interface TFunction<T extends TSchema[], U extends TSchema> extends TSchema, CustomOptions {
    $static: StaticFunction<T, U>;
    [Kind]: 'FunctionKind';
    type: 'function';
    arguments: TSchema[];
    returns: TSchema;
}
export interface TPromise<T extends TSchema> extends TSchema, CustomOptions {
    $static: StaticPromise<T>;
    [Kind]: 'PromiseKind';
    type: 'promise';
    item: TSchema;
}
export interface TUndefined extends TSchema, CustomOptions {
    $static: undefined;
    [Kind]: 'UndefinedKind';
    type: 'undefined';
}
export interface TVoid extends TSchema, CustomOptions {
    $static: void;
    [Kind]: 'VoidKind';
    type: 'void';
}
export declare type Selectable = TObject<TProperties> | TRef<TObject<TProperties>>;
export declare type SelectablePropertyKeys<T extends Selectable> = T extends TObject<infer U> ? keyof U : T extends TRef<TObject<infer U>> ? keyof U : never;
export declare type SelectableProperties<T extends Selectable> = T extends TObject<infer U> ? U : T extends TRef<TObject<infer U>> ? U : never;
export declare type UnionToIntersect<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export declare type StaticReadonlyOptionalPropertyKeys<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonlyOptional<TSchema> ? K : never;
}[keyof T];
export declare type StaticReadonlyPropertyKeys<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonly<TSchema> ? K : never;
}[keyof T];
export declare type StaticOptionalPropertyKeys<T extends TProperties> = {
    [K in keyof T]: T[K] extends TOptional<TSchema> ? K : never;
}[keyof T];
export declare type StaticRequiredPropertyKeys<T extends TProperties> = keyof Omit<T, StaticReadonlyOptionalPropertyKeys<T> | StaticReadonlyPropertyKeys<T> | StaticOptionalPropertyKeys<T>>;
export declare type StaticIntersectEvaluate<T extends readonly TSchema[]> = {
    [K in keyof T]: T[K] extends TSchema ? Static<T[K]> : never;
};
export declare type StaticIntersectReduce<I extends unknown, T extends readonly any[]> = T extends [infer A, ...infer B] ? StaticIntersectReduce<I & A, B> : I;
export declare type StaticRequired<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonlyOptional<infer U> ? TReadonly<U> : T[K] extends TReadonly<infer U> ? TReadonly<U> : T[K] extends TOptional<infer U> ? U : T[K];
};
export declare type StaticPartial<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonlyOptional<infer U> ? TReadonlyOptional<U> : T[K] extends TReadonly<infer U> ? TReadonlyOptional<U> : T[K] extends TOptional<infer U> ? TOptional<U> : TOptional<T[K]>;
};
export declare type StaticProperties<T extends TProperties> = {
    readonly [K in StaticReadonlyOptionalPropertyKeys<T>]?: Static<T[K]>;
} & {
    readonly [K in StaticReadonlyPropertyKeys<T>]: Static<T[K]>;
} & {
    [K in StaticOptionalPropertyKeys<T>]?: Static<T[K]>;
} & {
    [K in StaticRequiredPropertyKeys<T>]: Static<T[K]>;
};
export declare type StaticRecord<K extends TRecordKey, T extends TSchema> = K extends TString ? Record<string, Static<T>> : K extends TNumber ? Record<number, Static<T>> : K extends TKeyOf<TKey[]> ? Record<K['$static'], Static<T>> : K extends TUnion<TSchema[]> ? Record<K['$static'], Static<T>> : never;
export declare type StaticEnum<T> = T extends TEnumKey<infer U>[] ? U : never;
export declare type StaticKeyOf<T extends TKey[]> = T extends Array<infer K> ? K : never;
export declare type StaticIntersect<T extends readonly TSchema[]> = StaticIntersectReduce<unknown, StaticIntersectEvaluate<T>>;
export declare type StaticUnion<T extends readonly TSchema[]> = {
    [K in keyof T]: T[K] extends TSchema ? Static<T[K]> : never;
}[number];
export declare type StaticTuple<T extends readonly TSchema[]> = {
    [K in keyof T]: T[K] extends TSchema ? Static<T[K]> : never;
};
export declare type StaticObject<T extends TProperties> = StaticProperties<T> extends infer I ? {
    [K in keyof I]: I[K];
} : never;
export declare type StaticArray<T extends TSchema> = Array<Static<T>>;
export declare type StaticLiteral<T extends TValue> = T;
export declare type StaticParameters<T extends readonly TSchema[]> = {
    [K in keyof T]: T[K] extends TSchema ? Static<T[K]> : never;
};
export declare type StaticConstructor<T extends readonly TSchema[], U extends TSchema> = new (...args: [...StaticParameters<T>]) => Static<U>;
export declare type StaticFunction<T extends readonly TSchema[], U extends TSchema> = (...args: [...StaticParameters<T>]) => Static<U>;
export declare type StaticPromise<T extends TSchema> = Promise<Static<T>>;
export declare type Static<T extends TSchema> = T['$static'];
export declare class TypeBuilder {
    protected readonly schemas: Map<string, TSchema>;
    /** `Standard` Modifies an object property to be both readonly and optional */
    ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T>;
    /** `Standard` Modifies an object property to be readonly */
    Readonly<T extends TSchema>(item: T): TReadonly<T>;
    /** `Standard` Modifies an object property to be optional */
    Optional<T extends TSchema>(item: T): TOptional<T>;
    /** `Standard` Creates a type type */
    Tuple<T extends TSchema[]>(items: [...T], options?: CustomOptions): TTuple<T>;
    /** `Standard` Creates an object type with the given properties */
    Object<T extends TProperties>(properties: T, options?: ObjectOptions): TObject<T>;
    /** `Standard` Creates an intersect type. */
    Intersect<T extends TSchema[]>(items: [...T], options?: IntersectOptions): TIntersect<T>;
    /** `Standard` Creates a union type */
    Union<T extends TSchema[]>(items: [...T], options?: CustomOptions): TUnion<T>;
    /** `Standard` Creates an array type */
    Array<T extends TSchema>(items: T, options?: ArrayOptions): TArray<T>;
    /** `Standard` Creates an enum type from a TypeScript enum */
    Enum<T extends TEnumType>(item: T, options?: CustomOptions): TEnum<TEnumKey<T[keyof T]>[]>;
    /** `Standard` Creates a literal type. Supports string, number and boolean values only */
    Literal<T extends TValue>(value: T, options?: CustomOptions): TLiteral<T>;
    /** `Standard` Creates a string type */
    String<TCustomFormatOption extends string>(options?: StringOptions<StringFormatOption | TCustomFormatOption>): TString;
    /** `Standard` Creates a string type from a regular expression */
    RegEx(regex: RegExp, options?: CustomOptions): TString;
    /** `Standard` Creates a number type */
    Number(options?: NumberOptions): TNumber;
    /** `Standard` Creates an integer type */
    Integer(options?: NumberOptions): TInteger;
    /** `Standard` Creates a boolean type */
    Boolean(options?: CustomOptions): TBoolean;
    /** `Standard` Creates a null type */
    Null(options?: CustomOptions): TNull;
    /** `Standard` Creates an unknown type */
    Unknown(options?: CustomOptions): TUnknown;
    /** `Standard` Creates an any type */
    Any(options?: CustomOptions): TAny;
    /** `Standard` Creates a record type */
    Record<K extends TRecordKey, T extends TSchema>(key: K, value: T, options?: ObjectOptions): TRecord<K, T>;
    /** `Standard` Creates a keyof type from the given object */
    KeyOf<T extends TObject<TProperties> | TRef<TObject<TProperties>>>(object: T, options?: CustomOptions): TKeyOf<SelectablePropertyKeys<T>[]>;
    /** `Standard` Makes all properties in the given object type required */
    Required<T extends TObject<TProperties> | TRef<TObject<TProperties>>>(object: T, options?: ObjectOptions): TObject<StaticRequired<T['properties']>>;
    /** `Standard` Makes all properties in the given object type optional */
    Partial<T extends TObject<TProperties> | TRef<TObject<TProperties>>>(object: T, options?: ObjectOptions): TObject<StaticPartial<T['properties']>>;
    /** `Standard` Picks property keys from the given object type */
    Pick<T extends TObject<TProperties> | TRef<TObject<TProperties>>, K extends SelectablePropertyKeys<T>[]>(object: T, keys: [...K], options?: ObjectOptions): TObject<Pick<SelectableProperties<T>, K[number]>>;
    /** `Standard` Omits property keys from the given object type */
    Omit<T extends TObject<TProperties> | TRef<TObject<TProperties>>, K extends SelectablePropertyKeys<T>[]>(object: T, keys: [...K], options?: ObjectOptions): TObject<Omit<SelectableProperties<T>, K[number]>>;
    /** `Standard` Omits the `kind` and `modifier` properties from the underlying schema */
    Strict<T extends TSchema>(schema: T, options?: CustomOptions): T;
    /** `Extended` Creates a constructor type */
    Constructor<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options?: CustomOptions): TConstructor<T, U>;
    /** `Extended` Creates a function type */
    Function<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options?: CustomOptions): TFunction<T, U>;
    /** `Extended` Creates a promise type */
    Promise<T extends TSchema>(item: T, options?: CustomOptions): TPromise<T>;
    /** `Extended` Creates a undefined type */
    Undefined(options?: CustomOptions): TUndefined;
    /** `Extended` Creates a void type */
    Void(options?: CustomOptions): TVoid;
    /** `Standard` Creates a namespace for a set of related types */
    Namespace<T extends TDefinitions>($defs: T, options?: CustomOptions): TNamespace<T>;
    /** `Standard` References a type within a namespace. The referenced namespace must specify an `$id` */
    Ref<T extends TNamespace<TDefinitions>, K extends keyof T['$defs']>(namespace: T, key: K): TRef<T['$defs'][K]>;
    /** `Standard` References type. The referenced type must specify an `$id` */
    Ref<T extends TSchema>(schema: T): TRef<T>;
    /** `Experimental` Creates a recursive type */
    Rec<T extends TSchema>(callback: (self: TAny) => T, options?: CustomOptions): T;
    /** Conditionally stores and schema if it contains an $id and returns  */
    protected Store<T extends TSchema | TNamespace<TDefinitions>, S = Omit<T, '$static'>>(schema: S): T;
    /** Conditionally dereferences a schema if RefKind. Otherwise return argument */
    protected Deref<T extends TSchema>(schema: T): any;
}
export declare const Type: TypeBuilder;
