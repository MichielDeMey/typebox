import { Type, Static, Kind } from '@sinclair/typebox'

const T = Type.Rec(Self => Type.Object({
    x: Type.Number(),
    y: Type.Object({
        a: Type.Tuple([Type.Number(), Self]),
        b: Type.Array(Self)
    })
}))

console.log(JSON.stringify(T, null, 2))

type T = Static<typeof T>

// - Implement TRec
// Allow for multiple indirections via Ref
// Fix Required and Partial construction (should not mutate)
// Investigate Ref implementations (consider Tuple, Array, etc)







