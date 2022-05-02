import { useEffect, useState } from 'react'
import abstract from 'src/services/abstract/client'
import * as t from 'src/types'
import storage from 'src/local-storage'

// Provides access to the abstract api but
// caches the result in local storage

type AbstractState = {
  error: Error | null
  data: t.AbstractData | null
  ready: boolean
}

export default function useAbstract(): AbstractState {
  const [state, setState] = useState<AbstractState>({
    error: null,
    data: null,
    ready: false
  })
  useEffect(() => {
    const fetchAbstract = async () => {
      const cached = storage.abstract.get()
      if (cached) return setState({ ...state, data: cached })
      const [err, data] = await abstract.inquire()
      if (err) {
        setState({ ...state, error: err })
      } else {
        storage.abstract.set(data)
        setState({ ...state, data, ready: true })
      }
    }
    fetchAbstract()
  }, [])
  return state
}
