import { TSchema } from './typebox'

export const infer = <T extends TSchema>(_: T): typeof _['$static'] => null as any as T['$static']

export * from 'tsd'



