export declare const Kind: unique symbol;
export declare const Modifier: unique symbol;
export declare type TModifier = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>;
export declare type TReadonly<T extends TSchema> = T & {
    [Modifier]: 'Readonly';
};
export declare type TOptional<T extends TSchema> = T & {
    [Modifier]: 'Optional';
};
export declare type TReadonlyOptional<T extends TSchema> = T & {
    [Modifier]: 'ReadonlyOptional';
};
export interface SchemaOptions {
    $id?: string;
    title?: string;
    description?: string;
    default?: any;
    examples?: any;
    [prop: string]: any;
}
export interface TSchema extends SchemaOptions {
    $static: unknown;
    [Kind]: string;
    [Modifier]?: string;
}
export interface TAny extends TSchema {
    $static: any;
    [Kind]: 'Any';
}
export interface ArrayOptions extends SchemaOptions {
    uniqueItems?: boolean;
    minItems?: number;
    maxItems?: number;
}
export interface TArray<T extends TSchema> extends TSchema, ArrayOptions {
    $static: T['$static'][];
    [Kind]: 'Array';
    type: 'array';
    items: T;
}
export interface TBoolean extends TSchema {
    $static: boolean;
    [Kind]: 'Boolean';
    type: 'boolean';
}
declare type StaticConstructorParameters<T extends readonly TSchema[]> = [...{
    [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never;
}];
export interface TConstructor<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
    $static: new (...param: StaticConstructorParameters<T>) => U['$static'];
    [Kind]: 'Constructor';
    type: 'constructor';
    arguments: T;
    returns: U;
}
export interface TConstructorParameters<Constructor extends TConstructor> extends TSchema {
    $static: ConstructorParameters<Constructor['$static']>;
}
export interface TEnumOption<T> {
    type: 'number' | 'string';
    const: T;
}
export interface TEnum<T extends Record<string, string | number>> extends TSchema {
    $static: T[keyof T];
    [Kind]: 'Enum';
    anyOf: TEnumOption<T>[];
}
declare type StaticParameters<T extends readonly TSchema[]> = [...{
    [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never;
}];
export interface TFunction<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
    $static: (...param: StaticParameters<T>) => U['$static'];
    [Kind]: 'Function';
    type: 'function';
    arguments: T;
    returns: U;
}
export interface IntegerOptions extends SchemaOptions {
    exclusiveMaximum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    minimum?: number;
    multipleOf?: number;
}
export interface TInteger extends TSchema, IntegerOptions {
    $static: number;
    [Kind]: 'Integer';
    type: 'integer';
}
declare type StaticIntersectEvaluate<T extends readonly TSchema[]> = {
    [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never;
};
declare type StaticIntersectReduce<I extends unknown, T extends readonly any[]> = T extends [infer A, ...infer B] ? StaticIntersectReduce<I & A, B> : I;
export interface IntersectOptions extends SchemaOptions {
    unevaluatedProperties?: boolean;
}
export interface TIntersect<T extends TSchema[] = TSchema[]> extends TSchema, IntersectOptions {
    $static: StaticIntersectReduce<unknown, StaticIntersectEvaluate<T>>;
    [Kind]: 'Intersect';
    type: 'object';
    allOf: T;
}
export interface TKeyOf<T extends TObject | TRef<TObject>> extends TSchema {
    $static: keyof T['$static'];
    [Kind]: 'KeyOf';
    enum: keyof T['$static'][];
}
export declare type TLiteralValue = string | number | boolean;
export interface TLiteral<T extends TLiteralValue = TLiteralValue> extends TSchema {
    $static: T;
    [Kind]: 'Literal';
    const: T;
}
export interface TDefinitions {
    [name: string]: TSchema;
}
export interface TNamespace<T extends TDefinitions> extends TSchema {
    $static: {
        [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never;
    };
    [Kind]: 'Namespace';
    $defs: T;
}
export interface TNever extends TSchema {
    $static: never;
    [Kind]: 'Never';
    not: {};
}
export interface TNull extends TSchema {
    $static: null;
    [Kind]: 'Null';
    type: 'null';
}
export interface NumberOptions extends SchemaOptions {
    exclusiveMaximum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    minimum?: number;
    multipleOf?: number;
}
export interface TNumber extends TSchema, NumberOptions {
    $static: number;
    [Kind]: 'Number';
    type: 'number';
}
declare type StaticReadonlyOptionalPropertyKeys<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonlyOptional<TSchema> ? K : never;
}[keyof T];
declare type StaticReadonlyPropertyKeys<T extends TProperties> = {
    [K in keyof T]: T[K] extends TReadonly<TSchema> ? K : never;
}[keyof T];
declare type StaticOptionalPropertyKeys<T extends TProperties> = {
    [K in keyof T]: T[K] extends TOptional<TSchema> ? K : never;
}[keyof T];
declare type StaticRequiredPropertyKeys<T extends TProperties> = keyof Omit<T, StaticReadonlyOptionalPropertyKeys<T> | StaticReadonlyPropertyKeys<T> | StaticOptionalPropertyKeys<T>>;
declare type StaticProperties<T extends TProperties> = {
    readonly [K in StaticReadonlyOptionalPropertyKeys<T>]?: T[K]['$static'];
} & {
    readonly [K in StaticReadonlyPropertyKeys<T>]: T[K]['$static'];
} & {
    [K in StaticOptionalPropertyKeys<T>]?: T[K]['$static'];
} & {
    [K in StaticRequiredPropertyKeys<T>]: T[K]['$static'];
};
export interface TProperties {
    [key: string]: TSchema;
}
export interface ObjectOptions extends SchemaOptions {
    additionalProperties?: boolean;
}
export interface TObject<T extends TProperties = TProperties> extends TSchema, ObjectOptions {
    $static: StaticProperties<T> extends infer R ? {
        [K in keyof R]: R[K];
    } : never;
    [Kind]: 'Object';
    type: 'object';
    properties: T;
    required?: string[];
}
export interface TOmit<T extends TObject, Properties extends Array<keyof T['properties']>> extends TObject {
    $static: Omit<T['$static'], Properties[number] extends keyof T['$static'] ? Properties[number] : never>;
    properties: T extends TObject ? Omit<T['properties'], Properties[number]> : never;
}
export interface TParameters<Function extends TFunction> extends TSchema {
    $static: Parameters<Function['$static']>;
}
export interface TPartial<T extends TObject | TRef<TObject>> extends TObject {
    $static: Partial<T['$static']>;
}
export interface TPick<T extends TObject, Properties extends Array<keyof T['properties']>> extends TObject {
    $static: Pick<T['$static'], Properties[number] extends keyof T['$static'] ? Properties[number] : never>;
    properties: T extends TObject ? Pick<T['properties'], Properties[number]> : never;
}
export interface TPromise<T extends TSchema> extends TSchema {
    $static: Promise<T['$static']>;
    [Kind]: 'Promise';
    type: 'promise';
    item: TSchema;
}
export declare type StaticRecord<K extends TRecordKey, T extends TSchema> = K extends TString ? Record<string, T['$static']> : K extends TNumber ? Record<number, T['$static']> : K extends TKeyOf<TObject | TRef<TObject>> ? Record<K['$static'], T['$static']> : K extends TUnion<TLiteral[]> ? K['$static'] extends string ? Record<K['$static'], T['$static']> : never : never;
export declare type TRecordKey = TString | TNumber | TKeyOf<any> | TUnion<any>;
export interface TRecord<K extends TRecordKey, T extends TSchema> extends TSchema {
    $static: StaticRecord<K, T>;
    [Kind]: 'Record';
    type: 'object';
    patternProperties: {
        [pattern: string]: T;
    };
}
export interface TRef<T extends TSchema> extends TSchema {
    $static: T['$static'];
    [Kind]: 'Ref';
    $ref: string;
}
export interface TRegEx extends TSchema {
    $static: string;
    [Kind]: 'RegEx';
}
export interface TRequired<T extends TObject | TRef<TObject>> extends TObject {
    $static: Required<T['$static']>;
}
export declare type StringFormatOption = 'date-time' | 'time' | 'date' | 'email' | 'idn-email' | 'hostname' | 'idn-hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uri-reference' | 'iri' | 'uuid' | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer' | 'regex';
export interface StringOptions<TFormat extends string> extends SchemaOptions {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: TFormat;
    contentEncoding?: '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64';
    contentMediaType?: string;
}
export interface TString extends TSchema, StringOptions<string> {
    $static: string;
    [Kind]: 'String';
    type: 'string';
}
export interface TTuple<T extends TSchema[]> extends TSchema {
    $static: [...{
        [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never;
    }];
    [Kind]: 'Tuple';
    type: 'array';
    items?: T;
    additionalItems?: false;
    minItems: number;
    maxItems: number;
}
export interface TUndefined extends TSchema {
    $static: undefined;
    [Kind]: 'Undefined';
    type: 'undefined';
}
export interface TUnion<T extends TSchema[]> extends TSchema {
    $static: {
        [K in keyof T]: T[K] extends TSchema ? Static<T[K]> : never;
    }[number];
    [Kind]: 'Union';
    anyOf: T;
}
export interface TUnknown extends TSchema {
    $static: unknown;
    [Kind]: 'Unknown';
}
export interface TVoid extends TSchema {
    $static: void;
    [Kind]: 'Void';
    type: 'void';
}
export declare type Static<T extends TSchema> = T['$static'];
export declare class TypeBuilder {
    protected readonly schemas: Map<string, TSchema>;
    /** `Standard` Modifies an object property to be both readonly and optional */
    ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T>;
    /** `Standard` Modifies an object property to be readonly */
    Readonly<T extends TSchema>(item: T): TReadonly<T>;
    /** `Standard` Modifies an object property to be optional */
    Optional<T extends TSchema>(item: T): TOptional<T>;
    /** `Standard` Creates an any type */
    Any(options?: SchemaOptions): TAny;
    /** `Standard` Creates an array type */
    Array<T extends TSchema>(items: T, options?: ArrayOptions): TArray<T>;
    /** `Standard` Creates a boolean type */
    Boolean(options?: SchemaOptions): TBoolean;
    /** `Extended` Creates a constructor type */
    Constructor<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options?: SchemaOptions): TConstructor<T, U>;
    /** `Extended` Creates a tuple type by extracting the given constructor parameters */
    ConstructorParameters<Constructor extends TConstructor>(f: Constructor): TConstructorParameters<Constructor>;
    /** `Standard` Creates an enum type from a TypeScript enum */
    Enum<T extends Record<string, string | number>>(item: T, options?: SchemaOptions): TEnum<T>;
    /** `Extended` Creates a function type */
    Function<T extends TSchema[], U extends TSchema>(args: [...T], returns: U, options?: SchemaOptions): TFunction<T, U>;
    /** `Standard` Creates an integer type */
    Integer(options?: IntegerOptions): TInteger;
    /** `Standard` Creates an intersect type. */
    Intersect<T extends TSchema[]>(items: [...T], options?: IntersectOptions): TIntersect<T>;
    /** `Standard` Creates a keyof type from the given object */
    KeyOf<T extends TObject | TRef<TObject>>(object: T, options?: SchemaOptions): TKeyOf<T>;
    /** `Standard` Creates a literal type. Supports string, number and boolean values only */
    Literal<T extends TLiteralValue>(value: T, options?: SchemaOptions): TLiteral<T>;
    /** `Standard` Creates a namespace for a set of related types */
    Namespace<T extends TDefinitions>($defs: T, options?: SchemaOptions): TNamespace<T>;
    /** `Experimental` Creates a never type */
    Never(options?: SchemaOptions): TNever;
    /** `Standard` Creates a null type */
    Null(options?: SchemaOptions): TNull;
    /** `Standard` Creates a number type */
    Number(options?: NumberOptions): TNumber;
    /** `Standard` Creates an object type with the given properties */
    Object<T extends TProperties>(properties: T, options?: ObjectOptions): TObject<T>;
    /** `Standard` Omits property keys from the given object type */
    Omit<T extends TObject, Keys extends Array<keyof T['properties']>>(object: T, keys: [...Keys], options?: SchemaOptions): TOmit<T, Keys>;
    /** `Extended` Creates a tuple type by extracting the given functions parameters */
    Parameters<Function extends TFunction<TSchema[], TSchema>>(f: Function): TParameters<Function>;
    /** `Standard` Makes all properties in the given object type optional */
    Partial<T extends TObject | TRef<TObject>>(object: T, options?: ObjectOptions): TPartial<T>;
    /** `Standard` Picks property keys from the given object type */
    Pick<T extends TObject, Keys extends Array<keyof T['properties']>>(object: T, keys: [...Keys], options?: SchemaOptions): TPick<T, Keys>;
    /** `Extended` Creates a promise type */
    Promise<T extends TSchema>(item: T, options?: SchemaOptions): TPromise<T>;
    /** `Standard` Creates a record type */
    Record<K extends TRecordKey, T extends TSchema>(key: K, value: T, options?: ObjectOptions): TRecord<K, T>;
    /** `Experimental` Creates a recursive type */
    Rec<T extends TSchema>(callback: (self: TAny) => T, options?: SchemaOptions): T;
    /** `Standard` References a type within a namespace. The referenced namespace must specify an `$id` */
    Ref<T extends TNamespace<TDefinitions>, K extends keyof T['$defs']>(namespace: T, key: K): TRef<T['$defs'][K]>;
    /** `Standard` References type. The referenced type must specify an `$id` */
    Ref<T extends TSchema>(schema: T): TRef<T>;
    /** `Standard` Creates a string type from a regular expression */
    RegEx(regex: RegExp, options?: SchemaOptions): TString;
    /** `Standard` Makes all properties in the given object type required */
    Required<T extends TObject | TRef<TObject>>(object: T, options?: SchemaOptions): TRequired<T>;
    /** `Standard` Creates a string type */
    String<TCustomFormatOption extends string>(options?: StringOptions<StringFormatOption | TCustomFormatOption>): TString;
    /** `Standard` Creates a type type */
    Tuple<T extends TSchema[]>(items: [...T], options?: SchemaOptions): TTuple<T>;
    /** `Extended` Creates a undefined type */
    Undefined(options?: SchemaOptions): TUndefined;
    /** `Standard` Creates a union type */
    Union<T extends TSchema[]>(items: [...T], options?: SchemaOptions): TUnion<T>;
    /** `Standard` Creates an unknown type */
    Unknown(options?: SchemaOptions): TUnknown;
    /** `Extended` Creates a void type */
    Void(options?: SchemaOptions): TVoid;
    /** `Standard` Omits the `kind` and `modifier` properties from the underlying schema */
    Strict<T extends TSchema>(schema: T, options?: SchemaOptions): T;
    /** Conditionally stores and schema if it contains an $id and returns  */
    protected Create<T extends TSchema | TNamespace<TDefinitions>, S = Omit<T, '$static'>>(schema: S): T;
    /** Conditionally dereferences a schema if RefKind. Otherwise return argument */
    protected Deref<T extends TSchema>(schema: T): any;
}
export declare const Type: TypeBuilder;
export {};
