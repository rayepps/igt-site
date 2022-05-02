import { useEffect, useState } from 'react'
import parseUrl from 'url-parse'
import Recoil from 'recoil'
import ComplexQueryString from 'src/util/ComplexQueryString'
import * as t from 'src/types'
import {
  eventSearchOptionsState,
  eventSearchUrlQuerySelector
} from 'src/state/events'

type QueryStoredSearchOptions = Omit<t.EventSearchOptions, 'tags'> & { tags: string }

export const useUrlStateSync = () => {
  const queryString = Recoil.useRecoilValue(eventSearchUrlQuerySelector)
  const [options, setSearchOptions] = Recoil.useRecoilState(eventSearchOptionsState)

  // On first render, check if there is
  // a value in the url, parse it, and
  // set the state to it
  useEffect(() => {
    const qs = window.location.search
    if (!qs) return
    const state = ComplexQueryString.deserialize<QueryStoredSearchOptions>(qs, {
      date: (str) => str
    })
    setSearchOptions({
      ...options,
      ...(state as t.EventSearchOptions),
      tags: state.tags ? state.tags.split(';') : undefined
    })
  }, [])

  // Anytime the state changes, update
  // the url in place so a user can copy it and come
  // back to the same results later
  useEffect(() => {
    const url = parseUrl(window.location.href)
    const newUrl = url.set('query', queryString)
    window.history.pushState({}, '', newUrl.toString())
  }, [queryString])
}

export default useUrlStateSync
