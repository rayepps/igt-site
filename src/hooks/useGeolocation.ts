import { useEffect, useState } from 'react'
import * as t from 'src/types'
import useAbstract from './useAbstract'
import storage from 'src/local-storage'

// This is a hybrid broswer geolocation + abstract API
// hook that requests location access from the browser
// to get the longitude/latitude coordinates. It also
// makes a fetch request to the abstract API to get the
// readable city/state/country name.

type GeoState = {
  coords: t.GeoLocation | null
  error: GeolocationPositionError | null
}

type GeoLocationState = GeoState & {
  city: string | null
  state: string | null
  ready: boolean
}

export default function useGeolocation(): GeoLocationState {
  const abs = useAbstract()
  const [geo, setGeo] = useState<GeoState>({
    coords: null,
    error: null
  })
  const handlePosition: PositionCallback = (position) => {
    const location: t.GeoLocation = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    }
    storage.geolocation.set(location)
    setGeo({
      error: null,
      coords: location
    })
  }
  const handleError: PositionErrorCallback = err => {
    console.warn(err)
    setGeo({
      error: err,
      coords: null
    })
  }
  useEffect(() => {
    if (!navigator?.geolocation?.getCurrentPosition) return
    const existing = storage.geolocation.get()
    if (existing) {
      setGeo({
        error: null,
        coords: existing
      })
      return
    }
    navigator.geolocation.getCurrentPosition(handlePosition, handleError, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 1000 * 60 * 30
    })
  }, [])
  // Ready if the abstract hook has produced data
  // and the geo has produced coords without an
  // error
  return {
    coords: geo.coords,
    error: geo.error,
    city: abs.data?.city ?? null,
    state: abs.data?.region ?? null,
    ready: !!abs.data && (!geo.error && !!geo.coords)
  }
}
