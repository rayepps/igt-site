import { useState, useEffect } from 'react'
import type { LocalStorageItem } from 'src/local-storage'

/**
 * Provides an interface for interacting with an item from
 * the local-storage module that behaves as a React hook.
 * The updating of the state is automagically synced with
 * the value in local storage.
 * 
 * The third response item `isPersisted` tells you if the
 * value has been synced with what is on disk yet. This
 * only applies on load. When using with SSR this hook may
 * run on the server. `isPersisted` tells you that the value
 * returned represents the value currently on the browser. This
 * is most useful when you want to read a peice of state from local
 * storage before making changes.
 */
const useLocalStorageState = <T> (item: LocalStorageItem<T>, defaultValue: T): [T, (newValue: T) => void, boolean] => {
  const [state, setState] = useState<T>(defaultValue)
  const [isPersisted, setIsPersisted] = useState(false)
  useEffect(() => {
    const existing = item.get()
    if (existing) {
      setState(existing)
    } else {
      item.set(defaultValue)
    }
    setIsPersisted(true)
  }, [])
  const update = (newValue: T) => {
    item.set(newValue)
    setState(newValue)
  }
  return [state, update, isPersisted]
}

export default useLocalStorageState
