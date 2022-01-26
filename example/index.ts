import { Type, Static, Kind } from '@sinclair/typebox'

const A = Type.Object({
    x: Type.String(),
    y: Type.Number(),
    z: Type.String()
})

const B = Type.Object({
    a: Type.String(),
    b: Type.Number(),
    c: Type.String(),
})

const C = Type.Object({
    q: Type.String(),
    w: Type.Number(),
    e: Type.String(),
})

const NS = Type.Namespace({
    A: Type.String(),
    B: Type.String(),
})


type NS = Static<typeof NS>


const K = Type.KeyOf(C)

type K = Static<typeof K>

const O = Type.Union([
    Type.Literal('A'),
    Type.Literal('B'),
    Type.Literal('C')
])
type O = Static<typeof O>

const R = Type.Record(O, Type.String())

type R = Static<typeof R>


// Fix: TKey: There is something weird with TS 4.5.5
// Implement Parameters
// Implement ConstructorParameters
// Implement Return






