import { Type, Static, Kind } from '@sinclair/typebox'

const T = Type.Object({
    x: Type.String(),
    y: Type.Number(),
    z: Type.String()
}, { $id: 'T' })

const P = Type.Partial(T)
const X = Type.Required(P)
console.log(Type.Strict(X))

