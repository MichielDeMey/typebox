import { Type, Static, Kind } from '@sinclair/typebox'

const O = Type.Object({
    A: Type.Null(),
    B: Type.Null(),
    C: Type.Null(),
})

const P = Type.Pick(O, ['A', 'B'])

type P = Static<typeof P>

const K = Type.KeyOf(
    Type.Pick(Type.Object({
        A: Type.Null(),
        B: Type.Null(),
        C: Type.Null(),
    })
    , ['A', 'B'])
)

type K = Static<typeof K>

// Fix: TKey: There is something weird with TS 4.5.5
// Implement Parameters
// Implement ConstructorParameters
// Implement Return






