/*--------------------------------------------------------------------------

TypeBox: JSON Schema Type Builder with Static Type Resolution for TypeScript

The MIT License (MIT)

Copyright (c) 2021 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

// --------------------------------------------------------------------------
// Symbols
// --------------------------------------------------------------------------

export const Kind = Symbol.for('Kind')
export const Modifier = Symbol.for('Modifier')

// --------------------------------------------------------------------------
// Modifiers
// --------------------------------------------------------------------------

export type TModifier = TReadonlyOptional<TSchema> | TOptional<TSchema> | TReadonly<TSchema>

export type TReadonly<T extends TSchema> = T & { [Modifier]: 'Readonly' }

export type TOptional<T extends TSchema> = T & { [Modifier]: 'Optional' }

export type TReadonlyOptional<T extends TSchema> = T & { [Modifier]: 'ReadonlyOptional' }

// --------------------------------------------------------------------------
// TSchema
// --------------------------------------------------------------------------

export interface SchemaOptions {
    $schema?: string
    $id?: string
    title?: string
    description?: string
    default?: any
    examples?: any
    [prop: string]: any
}

export interface TSchema extends SchemaOptions {
    $static: unknown
    [Kind]: string
    [Modifier]?: string
}

// --------------------------------------------------------------------------
// TAny
// --------------------------------------------------------------------------

export interface TAny extends TSchema {
    $static: any,
    [Kind]: 'Any'
}

// --------------------------------------------------------------------------
// TArray
// --------------------------------------------------------------------------

export interface ArrayOptions extends SchemaOptions {
    uniqueItems?: boolean
    minItems?: number
    maxItems?: number
}

export interface TArray<T extends TSchema> extends TSchema, ArrayOptions {
    $static: T['$static'][],
    [Kind]: 'Array',
    type: 'array',
    items: T
}

// --------------------------------------------------------------------------
// TBoolean
// --------------------------------------------------------------------------

export interface TBoolean extends TSchema {
    $static: boolean,
    [Kind]: 'Boolean',
    type: 'boolean'
}

// --------------------------------------------------------------------------
// TConstructor
// --------------------------------------------------------------------------

type StaticConstructorParameters<T extends readonly TSchema[]> = [...{ [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never }]

export interface TConstructor<T extends TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
    $static: new (...param: StaticConstructorParameters<T>) => U['$static'],
    [Kind]: 'Constructor',
    type: 'constructor',
    parameters: T,
    returns: U
}

// --------------------------------------------------------------------------
// TEnum
// --------------------------------------------------------------------------

export interface TEnumOption<T> {
    type: 'number' | 'string'
    const: T
}

export interface TEnum<T extends Record<string, string | number>> extends TSchema {
    $static: T[keyof T]
    [Kind]: 'Enum'
    anyOf: TEnumOption<T>[]
}

// --------------------------------------------------------------------------
// TFunction
// --------------------------------------------------------------------------

type StaticParameters<T extends readonly TSchema[]> = [...{ [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never }]

export interface TFunction<T extends readonly TSchema[] = TSchema[], U extends TSchema = TSchema> extends TSchema {
    $static: (...param: StaticParameters<T>) => U['$static'],
    [Kind]: 'Function',
    type: 'function',
    parameters: T,
    returns: U
}

// --------------------------------------------------------------------------
// TInteger
// --------------------------------------------------------------------------

export interface IntegerOptions extends SchemaOptions {
    exclusiveMaximum?: number
    exclusiveMinimum?: number
    maximum?: number
    minimum?: number
    multipleOf?: number
}

export interface TInteger extends TSchema, IntegerOptions {
    $static: number,
    [Kind]: 'Integer',
    type: 'integer'
}
// --------------------------------------------------------------------------
// TIntersect
// --------------------------------------------------------------------------

type StaticIntersectEvaluate<T extends readonly TSchema[]> = { [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never }

type StaticIntersectReduce<I extends unknown, T extends readonly any[]> = T extends [infer A, ...infer B] ? StaticIntersectReduce<I & A, B> : I

export interface IntersectOptions extends SchemaOptions {
    unevaluatedProperties?: boolean
}

export interface TIntersect<T extends TSchema[] = TSchema[]> extends TSchema, IntersectOptions {
    $static: StaticIntersectReduce<unknown, StaticIntersectEvaluate<T>>,
    [Kind]: 'Intersect',
    type: 'object',
    allOf: T
}

// --------------------------------------------------------------------------
// TKeyOf
// --------------------------------------------------------------------------

export interface TKeyOf<T extends TObject | TRef<TObject>> extends TSchema {
    $static: keyof T['$static']
    [Kind]: 'KeyOf'
    enum: keyof T['$static'][]
}

// --------------------------------------------------------------------------
// TLiteral
// --------------------------------------------------------------------------

export type TLiteralValue = string | number | boolean

export interface TLiteral<T extends TLiteralValue = TLiteralValue> extends TSchema {
    $static: T,
    [Kind]: 'Literal',
    const: T
}

// --------------------------------------------------------------------------
// TNamespace
// --------------------------------------------------------------------------

export interface TDefinitions {
    [name: string]: TSchema
}

export interface TNamespace<T extends TDefinitions> extends TSchema {
    $static: { [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never }
    [Kind]: 'Namespace',
    $defs: T
}

// --------------------------------------------------------------------------
// TNull
// --------------------------------------------------------------------------

export interface TNull extends TSchema {
    $static: null,
    [Kind]: 'Null',
    type: 'null'
}

// --------------------------------------------------------------------------
// TNumber
// --------------------------------------------------------------------------

export interface NumberOptions extends SchemaOptions {
    exclusiveMaximum?: number
    exclusiveMinimum?: number
    maximum?: number
    minimum?: number
    multipleOf?: number
}

export interface TNumber extends TSchema, NumberOptions {
    $static: number,
    [Kind]: 'Number',
    type: 'number'
}

// --------------------------------------------------------------------------
// TObject
// --------------------------------------------------------------------------

type StaticReadonlyOptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonlyOptional<TSchema> ? K : never }[keyof T]

type StaticReadonlyPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TReadonly<TSchema> ? K : never }[keyof T]

type StaticOptionalPropertyKeys<T extends TProperties> = { [K in keyof T]: T[K] extends TOptional<TSchema> ? K : never }[keyof T]

type StaticRequiredPropertyKeys<T extends TProperties> = keyof Omit<T, StaticReadonlyOptionalPropertyKeys<T> | StaticReadonlyPropertyKeys<T> | StaticOptionalPropertyKeys<T>>

type StaticProperties<T extends TProperties> =
    (
        { readonly [K in StaticReadonlyOptionalPropertyKeys<T>]?: T[K]['$static'] } &
        { readonly [K in StaticReadonlyPropertyKeys<T>]: T[K]['$static'] } &
        { [K in StaticOptionalPropertyKeys<T>]?: T[K]['$static'] } &
        { [K in StaticRequiredPropertyKeys<T>]: T[K]['$static'] }
    ) extends infer R ? {
        [K in keyof R]: R[K]
    } : never

export interface TProperties { [key: string]: TSchema }

export interface ObjectOptions extends SchemaOptions {
    additionalProperties?: boolean
}

export interface TObject<T extends TProperties = TProperties> extends TSchema, ObjectOptions {
    $static: StaticProperties<T>
    [Kind]: 'Object',
    type: 'object',
    properties: T,
    required?: string[]
}

// --------------------------------------------------------------------------
// TOmit
// --------------------------------------------------------------------------

export interface TOmit<T extends TObject, Properties extends Array<keyof T['properties']>> extends TObject {
    $static: Omit<T['$static'], Properties[number] extends keyof T['$static'] ? Properties[number] : never>
    properties: T extends TObject ? Omit<T['properties'], Properties[number]> : never
}

// --------------------------------------------------------------------------
// TPartial
// --------------------------------------------------------------------------

export interface TPartial<T extends TObject | TRef<TObject>> extends TObject {
    $static: Partial<T['$static']>
}

// --------------------------------------------------------------------------
// TPick
// --------------------------------------------------------------------------

export interface TPick<T extends TObject, Properties extends Array<keyof T['properties']>> extends TObject {
    $static: Pick<T['$static'], Properties[number] extends keyof T['$static'] ? Properties[number] : never>
    properties: T extends TObject ? Pick<T['properties'], Properties[number]> : never
}

// --------------------------------------------------------------------------
// TPromise
// --------------------------------------------------------------------------

export interface TPromise<T extends TSchema> extends TSchema {
    $static: Promise<T['$static']>,
    [Kind]: 'Promise',
    type: 'promise',
    item: TSchema
}

// --------------------------------------------------------------------------
// TRecord
// --------------------------------------------------------------------------

export type StaticRecord<K extends TRecordKey, T extends TSchema> =
    K extends TString ? Record<string, T['$static']> :
    K extends TNumber ? Record<number, T['$static']> :
    K extends TKeyOf<TObject | TRef<TObject>> ? Record<K['$static'], T['$static']> :
    K extends TUnion<TLiteral[]> ? K['$static'] extends string ? Record<K['$static'], T['$static']> : never :
    never

export type TRecordKey = TString | TNumber | TKeyOf<any> | TUnion<any>

export interface TRecord<K extends TRecordKey, T extends TSchema> extends TSchema {
    $static: StaticRecord<K, T>,
    [Kind]: 'Record',
    type: 'object',
    patternProperties: { [pattern: string]: T }
}

// --------------------------------------------------------------------------
// TRec
// --------------------------------------------------------------------------

export interface TRec<T extends TSchema> extends TSchema {
    $static: T['$static']
    [Kind]: 'TRec'
    $ref: string,
    $defs: unknown
}

// --------------------------------------------------------------------------
// TRef
// --------------------------------------------------------------------------

export interface TRef<T extends TSchema> extends TSchema {
    $static: T['$static'],
    [Kind]: 'Ref',
    $ref: string
}

// --------------------------------------------------------------------------
// TRegEx
// --------------------------------------------------------------------------

export interface TRegEx extends TSchema {
    $static: string
    [Kind]: 'RegEx'
}

// --------------------------------------------------------------------------
// TRequired
// --------------------------------------------------------------------------

export interface TRequired<T extends TObject | TRef<TObject>> extends TObject {
    $static: Required<T['$static']>
}

// --------------------------------------------------------------------------
// TString
// --------------------------------------------------------------------------

export type StringFormatOption =
    | 'date-time' | 'time' | 'date' | 'email' | 'idn-email' | 'hostname'
    | 'idn-hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uri-reference' | 'iri'
    | 'uuid' | 'iri-reference' | 'uri-template' | 'json-pointer' | 'relative-json-pointer'
    | 'regex'

export interface StringOptions<TFormat extends string> extends SchemaOptions {
    minLength?: number
    maxLength?: number
    pattern?: string
    format?: TFormat
    contentEncoding?: '7bit' | '8bit' | 'binary' | 'quoted-printable' | 'base64'
    contentMediaType?: string
}

export interface TString extends TSchema, StringOptions<string> {
    $static: string,
    [Kind]: 'String',
    type: 'string'
}

// --------------------------------------------------------------------------
// TTuple
// --------------------------------------------------------------------------

export interface TTuple<T extends TSchema[]> extends TSchema {
    $static: [...{ [K in keyof T]: T[K] extends TSchema ? T[K]['$static'] : never }],
    [Kind]: 'Tuple',
    type: 'array',
    items?: T,
    additionalItems?: false,
    minItems: number,
    maxItems: number
}

// --------------------------------------------------------------------------
// TUndefined
// --------------------------------------------------------------------------

export interface TUndefined extends TSchema {
    $static: undefined,
    [Kind]: 'Undefined',
    type: 'undefined'
}

// --------------------------------------------------------------------------
// TUnion
// --------------------------------------------------------------------------

export interface TUnion<T extends TSchema[]> extends TSchema {
    $static: { [K in keyof T]: T[K] extends TSchema ? Static<T[K]> : never }[number],
    [Kind]: 'Union',
    anyOf: T
}

// --------------------------------------------------------------------------
// TUnknown
// --------------------------------------------------------------------------

export interface TUnknown extends TSchema {
    $static: unknown,
    [Kind]: 'Unknown'
}

// --------------------------------------------------------------------------
// TVoid
// --------------------------------------------------------------------------

export interface TVoid extends TSchema {
    $static: void,
    [Kind]: 'Void',
    type: 'void'
}

// --------------------------------------------------------------------------
// Static<T>
// --------------------------------------------------------------------------

export type Static<T extends TSchema> = T['$static']


// --------------------------------------------------------------------------
// TypeBuilder
// --------------------------------------------------------------------------

export class TypeBuilder {

    protected readonly schemas: Map<string, TSchema>

    constructor() {
        this.schemas = new Map<string, TSchema>()
    }

    // ----------------------------------------------------------------------
    // Modifiers
    // ----------------------------------------------------------------------


    /** Modifies an object property to be both readonly and optional */
    public ReadonlyOptional<T extends TSchema>(item: T): TReadonlyOptional<T> {
        return { [Modifier]: 'ReadonlyOptional', ...item }
    }

    /** Modifies an object property to be readonly */
    public Readonly<T extends TSchema>(item: T): TReadonly<T> {
        return { [Modifier]: 'Readonly', ...item }
    }

    /** Modifies an object property to be optional */
    public Optional<T extends TSchema>(item: T): TOptional<T> {
        return { [Modifier]: 'Optional', ...item }
    }

    // ----------------------------------------------------------------------
    // Types
    // ----------------------------------------------------------------------

    /** Creates an any type */
    public Any(options: SchemaOptions = {}): TAny {
        return this.Create({ ...options, [Kind]: 'Any' })
    }

    /** Creates an array type */
    public Array<T extends TSchema>(items: T, options: ArrayOptions = {}): TArray<T> {
        return this.Create({ ...options, [Kind]: 'Array', type: 'array', items })
    }

    /** Creates a boolean type */
    public Boolean(options: SchemaOptions = {}): TBoolean {
        return this.Create({ ...options, [Kind]: 'Boolean', type: 'boolean' })
    }

    /** `Extended` Creates a constructor type */
    public Constructor<T extends TSchema[], U extends TSchema>(parameters: [...T], returns: U, options: SchemaOptions = {}): TConstructor<T, U> {
        return this.Create({ ...options, [Kind]: 'Constructor', type: 'constructor', parameters, returns })
    }

    /** Creates an enum type from a TypeScript enum */
    public Enum<T extends Record<string, string | number>>(item: T, options: SchemaOptions = {}): TEnum<T> {
        const values = Object.keys(item).filter(key => isNaN(key as any)).map(key => item[key]) as T[keyof T][]
        const anyOf = values.map(value => typeof value === 'string' ? { type: 'string' as const, const: value } : { type: 'number' as const, const: value })
        return this.Create({ ...options, [Kind]: 'Enum', anyOf })
    }

    /** `Extended` Creates a function type */
    public Function<T extends readonly TSchema[], U extends TSchema>(parameters: [...T], returns: U, options: SchemaOptions = {}): TFunction<T, U> {
        return this.Create({ ...options, [Kind]: 'Function', type: 'function', parameters, returns })
    }

    /** Creates an integer type */
    public Integer(options: IntegerOptions = {}): TInteger {
        return this.Create({ ...options, [Kind]: 'Integer', type: 'integer' })
    }

    /** Creates an intersect type. */
    public Intersect<T extends TSchema[]>(items: [...T], options: IntersectOptions = {}): TIntersect<T> {
        return this.Create({ ...options, [Kind]: 'Intersect', type: 'object', allOf: items })
    }

    /** Creates a keyof type from the given object */
    public KeyOf<T extends TObject | TRef<TObject>>(object: T, options: SchemaOptions = {}): TKeyOf<T> {
        const source = this.Deref(object)
        const keys = Object.keys(source.properties)
        return this.Create({ ...options, [Kind]: 'KeyOf', type: 'string', enum: keys })
    }

    /** Creates a literal type. Supports string, number and boolean values only */
    public Literal<T extends TLiteralValue>(value: T, options: SchemaOptions = {}): TLiteral<T> {
        return this.Create({ ...options, [Kind]: 'Literal', const: value, type: typeof value as 'string' | 'number' | 'boolean' })
    }

    /** Creates a namespace for a set of related types */
    public Namespace<T extends TDefinitions>($defs: T, options: SchemaOptions = {}): TNamespace<T> {
        return this.Create({ ...options, [Kind]: 'Namespace', $defs })
    }

    /** Creates a null type */
    public Null(options: SchemaOptions = {}): TNull {
        return this.Create({ ...options, [Kind]: 'Null', type: 'null' })
    }

    /** Creates a number type */
    public Number(options: NumberOptions = {}): TNumber {
        return this.Create({ ...options, [Kind]: 'Number', type: 'number' })
    }

    /** Creates an object type with the given properties */
    public Object<T extends TProperties>(properties: T, options: ObjectOptions = {}): TObject<T> {
        const property_names = Object.keys(properties)
        const optional = property_names.filter(name => {
            const property = properties[name] as TModifier
            const modifier = property[Modifier]
            return (modifier &&
                (modifier === 'Optional' ||
                    modifier === 'ReadonlyOptional'))
        })
        const required_names = property_names.filter(name => !optional.includes(name))
        const required = (required_names.length > 0) ? required_names : undefined
        return this.Create(((required)
            ? { ...options, [Kind]: 'Object', type: 'object', properties, required }
            : { ...options, [Kind]: 'Object', type: 'object', properties }))
    }

    /** Omits property keys from the given object type */
    public Omit<T extends TObject, Keys extends Array<keyof T['properties']>>(object: T, keys: [...Keys], options: SchemaOptions = {}): TOmit<T, Keys> {
        const source = this.Deref(object)
        const schema = { ...this.Clone(source), ...options }
        schema.required = schema.required ? schema.required.filter((key: string) => !keys.includes(key as any)) : undefined
        for (const key of Object.keys(schema.properties)) {
            if (keys.includes(key as any)) delete schema.properties[key]
        }
        return this.Create(schema)
    }

    /** Makes all properties in the given object type optional */
    public Partial<T extends TObject | TRef<TObject>>(object: T, options: ObjectOptions = {}): TPartial<T> {
        const source = this.Deref(object)
        const schema = { ...this.Clone(source) as T, ...options }
        delete schema.required
        for (const key of Object.keys(schema.properties)) {
            const property = schema.properties[key]
            const modifier = property[Modifier]
            switch (modifier) {
                case 'ReadonlyOptional': property[Modifier] = 'ReadonlyOptional'; break;
                case 'Readonly': property[Modifier] = 'ReadonlyOptional'; break;
                case 'Optional': property[Modifier] = 'Optional'; break;
                default: property[Modifier] = 'Optional'; break;
            }
        }
        return this.Create(schema as unknown as TPartial<T>)
    }

    /** Picks property keys from the given object type */
    public Pick<T extends TObject, Keys extends Array<keyof T['properties']>>(object: T, keys: [...Keys], options: SchemaOptions = {}): TPick<T, Keys> {
        const source = this.Deref(object)
        const schema = { ...this.Clone(source), ...options }
        schema.required = schema.required ? schema.required.filter((key: any) => keys.includes(key)) : undefined
        for (const key of Object.keys(schema.properties)) {
            if (!keys.includes(key as any)) delete schema.properties[key]
        }
        return this.Create(schema)
    }

    /** `Extended` Creates a promise type */
    public Promise<T extends TSchema>(item: T, options: SchemaOptions = {}): TPromise<T> {
        return this.Create({ ...options, [Kind]: 'Promise', type: 'promise', item })
    }

    /** Creates a record type */
    public Record<K extends TRecordKey, T extends TSchema>(key: K, value: T, options: ObjectOptions = {}): TRecord<K, T> {
        const pattern = (() => {
            switch (key[Kind]) {
                case 'Union': return `^${key.anyOf.map((literal: any) => literal.const as TLiteralValue).join('|')}$`
                case 'KeyOf': return `^${key.enum.join('|')}$`
                case 'Number': return '^(0|[1-9][0-9]*)$'
                case 'String': return key.pattern ? key.pattern : '^.*$'
                default: throw Error('Invalid Record Key')
            }
        })()
        return this.Create({ ...options, [Kind]: 'Record', type: 'object', patternProperties: { [pattern]: value } })
    }

    /** `Experimental` Creates a recursive type */
    public Rec<T extends TSchema>(callback: (self: TAny) => T, options: SchemaOptions = {}): TRec<T> {
        const $id = options.$id || ''
        const self = callback({ $ref: `${$id}#/$defs/self` } as any)
        return this.Create({ ...options, [Kind]: 'Rec', $ref: `${$id}#/$defs/self`, $defs: { self } } as any)
    }

    /** References a type within a namespace. The referenced namespace must specify an `$id` */
    public Ref<T extends TNamespace<TDefinitions>, K extends keyof T['$defs']>(namespace: T, key: K): TRef<T['$defs'][K]>

    /** References type. The referenced type must specify an `$id` */
    public Ref<T extends TSchema>(schema: T): TRef<T>

    public Ref(...args: any[]): any {
        if (args.length === 2) {
            const namespace = args[0] as TNamespace<TDefinitions>
            const targetKey = args[1] as string
            if (namespace.$id === undefined) throw new Error(`Referenced namespace has no $id`)
            if (!this.schemas.has(namespace.$id)) throw new Error(`Unable to locate namespace with $id '${namespace.$id}'`)
            return this.Create({ [Kind]: 'Ref', $ref: `${namespace.$id}#/$defs/${targetKey}` })
        } else if (args.length === 1) {
            const target = args[0] as any
            if (target.$id === undefined) throw new Error(`Referenced schema has no $id`)
            if (!this.schemas.has(target.$id)) throw new Error(`Unable to locate schema with $id '${target.$id}'`)
            return this.Create({ [Kind]: 'Ref', $ref: target.$id })
        } else {
            throw new Error('Type.Ref: Invalid arguments')
        }
    }

    /** Creates a string type from a regular expression */
    public RegEx(regex: RegExp, options: SchemaOptions = {}): TString {
        return this.String({ ...options, pattern: regex.source })
    }

    /** Makes all properties in the given object type required */
    public Required<T extends TObject | TRef<TObject>>(object: T, options: SchemaOptions = {}): TRequired<T> {
        const source = this.Deref(object)
        const schema = { ...this.Clone(source) as T, ...options }
        schema.required = Object.keys(schema.properties)
        for (const key of Object.keys(schema.properties)) {
            const property = schema.properties[key]
            const modifier = property[Modifier]
            switch (modifier) {
                case 'ReadonlyOptional': property[Modifier] = 'Readonly'; break;
                case 'Readonly': property[Modifier] = 'Readonly'; break;
                case 'Optional': delete property[Modifier]; break;
                default: delete property[Modifier]; break;
            }
        }
        return this.Create(schema as unknown as TRequired<T>)
    }

    /** Creates a string type */
    public String<TCustomFormatOption extends string>(options: StringOptions<StringFormatOption | TCustomFormatOption> = {}): TString {
        return this.Create({ ...options, [Kind]: 'String', type: 'string' })
    }

    /** Creates a type type */
    public Tuple<T extends TSchema[]>(items: [...T], options: SchemaOptions = {}): TTuple<T> {
        const additionalItems = false
        const minItems = items.length
        const maxItems = items.length
        const schema = ((items.length > 0)
            ? { ...options, [Kind]: 'Tuple', type: 'array', items, additionalItems, minItems, maxItems }
            : { ...options, [Kind]: 'Tuple', type: 'array', minItems, maxItems }) as any
        return this.Create(schema)
    }

    /** `Extended` Creates a undefined type */
    public Undefined(options: SchemaOptions = {}): TUndefined {
        return this.Create({ ...options, [Kind]: 'Undefined', type: 'undefined' })
    }

    /** Creates a union type */
    public Union<T extends TSchema[]>(items: [...T], options: SchemaOptions = {}): TUnion<T> {
        return this.Create({ ...options, [Kind]: 'Union', anyOf: items })
    }

    /** Creates an unknown type */
    public Unknown(options: SchemaOptions = {}): TUnknown {
        return this.Create({ ...options, [Kind]: 'Unknown' })
    }

    /** `Extended` Creates a void type */
    public Void(options: SchemaOptions = {}): TVoid {
        return this.Create({ ...options, [Kind]: 'Void', type: 'void' })
    }

    /** Omits the `kind` and `modifier` properties from the underlying schema */
    public Strict<T extends TSchema>(schema: T, options: SchemaOptions = {}): T {
        return JSON.parse(JSON.stringify({ ...options, ...schema })) as T
    }

    /** Clones the given object */
    protected Clone(object: any): any {
        const isObject = (object: any): object is Record<string | symbol, any> => typeof object === 'object' && object !== null && !Array.isArray(object)
        const isArray = (object: any): object is any[] => typeof object === 'object' && object !== null && Array.isArray(object)
        if (isObject(object)) {
            return Object.keys(object).reduce((acc, key) => ({
                ...acc, [key]: this.Clone(object[key])
            }), Object.getOwnPropertySymbols(object).reduce((acc, key) => ({
                ...acc, [key]: this.Clone(object[key])
            }), {}))
        } else if (isArray(object)) {
            return object.map((item: any) => this.Clone(item))
        } else {
            return object
        }
    }

    /** Conditionally stores and schema if it contains an $id and returns  */
    protected Create<T extends TSchema>(schema: Omit<T, '$static'>): T {
        const $schema: any = schema
        if (!$schema['$id']) return $schema
        this.schemas.set($schema['$id'], $schema)
        return $schema
    }

    /** Conditionally dereferences a schema if RefKind. Otherwise return argument */
    protected Deref<T extends TSchema>(schema: T): any {
        const $schema: any = schema
        if ($schema[Kind] !== 'Ref') return schema
        if (!this.schemas.has($schema['$ref'])) throw Error(`Unable to locate schema with $id '${$schema['$ref']}'`)
        return this.Deref(this.schemas.get($schema['$ref'])!)
    }
}


export const Type = new TypeBuilder()
