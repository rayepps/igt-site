import _ from 'radash'
import { atom, atomFamily, selector } from 'recoil'
import * as t from '../types'
import ComplexQueryString from 'src/util/ComplexQueryString'
import * as uuid from 'uuid'

export const eventsState = atomFamily({
  key: 'eventsState',
  default: null as t.Event | null
})

export const trainingsState = atomFamily({
  key: 'trainingsState',
  default: null as t.Training | null
})

export const eventSearchState = atom({
  key: 'eventSearchState',
  default: {
    total: 0,
    results: [] as string[]
  }
})

export const trainingSearchState = atom({
  key: 'trainingSearchState',
  default: {
    total: 0,
    results: [] as string[]
  }
})

export const eventSearchStateSelector = selector<t.Event[]>({
  key: 'eventSearchStateSelector',
  get: ({ get }) => {
    const { results: ids } = get(eventSearchState)
    return ids.map(id => get(eventsState(id))).filter(x => !!x) as t.Event[]
  }
})

export const currentEventIdState = atom<null | string>({
  key: 'currentEventIdState',
  default: null
})

export const currentTrainingIdState = atom<null | string>({
  key: 'currentTrainingIdState',
  default: null
})

export const eventSearchOptionsState = atom<t.EventSearchOptions & {
  page: number
  pageSize: number
}>({
  key: 'eventSearchOptionsState',
  default: {
    page: 1,
    pageSize: 25
  }
})

export const eventSearchUrlQuerySelector = selector<string>({
  key: 'eventSearchUrlQuerySelector',
  get: ({ get }) => {
    const options = get(eventSearchOptionsState)
    // Build an object with keys as option key names
    // and values as undefined and apply it to the
    // object to force out those values from the query
    // string.
    const overrides = options.overrides
      ? _.mapValues(_.objectify(options.overrides, o => o), _v => undefined)
      : {}
    return ComplexQueryString.serialize({
      ...options,
      near: undefined,
      // If the page is at default, no need to add it to the query
      // string the API will default to 1/25
      page: options.page === 1 ? undefined : options.page,
      pageSize: options.pageSize === 25 ? undefined : options.pageSize,
      // Flatten tags to a ; seperated string if they exist
      tags: options.tags?.join(';') ?? undefined,
      overrides: undefined,
      ...overrides
    })
  }
})

/**
 * Based on the query string (which should be a stable hash-like
 * string based on all user input filter/sort/page data) generate
 * a stable uuid. We'll use this to lookup previous API queries
 * without making the request again.
 */
export const eventSearchHashSelector = selector<string>({
  key: 'eventSearchHashSelector',
  get: ({ get }) => {
    const options = get(eventSearchOptionsState)
    return uuid.v5(JSON.stringify({
      qs: get(eventSearchUrlQuerySelector),
      overrides: options.overrides,
      near: !!options.near
    }), uuid.v5.DNS)
  }
})

export const currentEventSelector = selector<t.Event | null>({
  key: 'currentEventSelector',
  get: ({ get }) => {
    const eventId = get(currentEventIdState)
    if (!eventId) return null
    return get(eventsState(eventId)) ?? null
  }
})

export const currentTrainingSelector = selector<t.Training | null>({
  key: 'currentTrainingSelector',
  get: ({ get }) => {
    const trainingId = get(currentTrainingIdState)
    if (!trainingId) return null
    return get(trainingsState(trainingId)) ?? null
  }
})

export const eventSearchBasedTrainingOptionsSelector = selector<t.TrainingSearchOptions>({
  key: 'eventSearchBasedTrainingOptionsSelector',
  get: ({ get }) => {
    const eventOptions = get(eventSearchOptionsState)
    return {
      pageSize: 25, // always limit to 6 when event search based
      page: 1, // always limit to first page when event search based
      order: eventOptions.order as t.TrainingSearchOrder,
      type: eventOptions.type,
      tags: eventOptions.tags,
      state: eventOptions.state,
      city: eventOptions.city,
      company: eventOptions.company,
      appointmentOnly: true // always true when event search based
    }
  }
})

export const eventSearchBasedTrainingHashSelector = selector<string>({
  key: 'eventSearchBasedTrainingHashSelector',
  get: ({ get }) => {
    return uuid.v5(get(eventSearchUrlQuerySelector), uuid.v5.DNS)
  }
})