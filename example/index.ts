import { Type, Static } from '@sinclair/typebox'

const T = Type.Object({
    A: Type.Union([]),
    B: Type.Intersect([]),
    C: Type.Readonly(Type.String())
})

console.log(T)

console.log(Object.getOwnPropertySymbols(T))
console.log(Object.keys(T))
type T = Static<typeof T>









