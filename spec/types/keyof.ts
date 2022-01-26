import * as Spec from './spec'
import { Type } from './typebox'

{
    const K = Type.KeyOf(
        Type.Object({
            A: Type.Null(),
            B: Type.Null(),
            C: Type.Null(),
        })
    )
    Spec.expectType<'A' | 'B' | 'C'>(Spec.infer(K))
}

{
    const Q = Type.Pick(
        Type.Object({
            A: Type.Null(),
            B: Type.Null(),
            C: Type.Null(),
        }), ['A', 'B']
    )
    
    const K = Type.KeyOf(
        Type.Pick(
            Type.Object({
                A: Type.Null(),
                B: Type.Null(),
                C: Type.Null(),
            }), ['A', 'B']
        )
    )

    const X = Spec.infer(K);
    Spec.expectAssignable<'A' | 'B'>(X)
}

{
    const K = Type.KeyOf(
        Type.Omit(
            Type.Object({
                A: Type.Null(),
                B: Type.Null(),
                C: Type.Null(),
            }), ['A', 'B']
        )
    )
    Spec.expectType<'C'>(Spec.infer(K))
}