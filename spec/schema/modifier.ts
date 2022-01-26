import { Type, Modifier } from '@sinclair/typebox'
import * as assert from 'assert'

describe('Modifier', () => {
    it('Omit modifier', () => {
        const T = Type.Object({
            a: Type.Readonly(Type.String()),
            b: Type.Optional(Type.String()),
        })

        const S = JSON.stringify(T)
        const P = JSON.parse(S) as any

        // check assignment on Type
        assert.equal(T.properties.a[Modifier], 'ReadonlyModifier')
        assert.equal(T.properties.b[Modifier], 'OptionalModifier')

        // check deserialized
        assert.equal(P.properties.a[Modifier], undefined)
        assert.equal(P.properties.b[Modifier], undefined)
    })
})
