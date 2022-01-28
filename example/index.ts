import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
    A: Type.ReadonlyOptional(Type.Number()),
    B: Type.Optional(Type.Number()),
    C: Type.Readonly(Type.String()),
    D: Type.Number()
})

console.log(T)

type T = Static<typeof T>











