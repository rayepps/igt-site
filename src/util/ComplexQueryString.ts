import * as _ from 'radash'
import flat from 'flat'

const typify = (obj: Record<string, any>, overrides: Record<string, (str: string) => any> = {}): Record<string, any> => {
  const toType = (key: string, value: any): any => {
    if (overrides[key]) return overrides[key](value)
    if (value === 'true') return true
    if (value === 'false') return false
    if (_.isArray(value)) return (value as any[]).map(toType)
    if (_.isObject(value)) return typify(value)
    const num = parseInt(value)
    if (!Number.isNaN(num)) return num
    return value
  }
  return Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: toType(key, value)
    }),
    {} as Record<string, any>
  )
}

/**
 * Converts an object into a complex query
 * string. Does not handle arrays of objects.
 */
const serialize = (obj: Record<string, string | number | undefined | boolean | null>): string => {
  const allStrings = _.mapValues(_.shake(obj), v => `${v}`)
  return new URLSearchParams(allStrings).toString()
}

/**
 * Converts a query string that was created by
 * the serialize function back into the original
 * object
 */
const deserialize = <T>(qs: string, mappers: Record<string, (str: string) => any>): Partial<T> => {
  const urlSearchParams = new URLSearchParams(qs)
  const params = Object.fromEntries(urlSearchParams.entries())
  return typify(params as any, mappers) as Partial<T>
}

export default {
  serialize,
  deserialize
}
