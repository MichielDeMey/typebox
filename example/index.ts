import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
    A: Type.Number(),
    B: Type.Number(),
    C: Type.Number(),
    D: Type.Number()
}, { $id: 'T' })

const R1 = Type.Ref(T)


type R2 = Static<typeof R2>

console.log(T)

type T = Static<typeof T>











