import React, { EffectCallback, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { createCustomEqual } from 'fast-equals'

export interface MapLocation {
  latitude: number
  longitude: number
  city: string
  state: string
}

interface MapProps extends google.maps.MapOptions {
  children: ReactNode
  className?: string
  onClick?: (e: google.maps.MapMouseEvent) => void
  onIdle?: (map: google.maps.Map) => void
}

export default function GoogleMap({
  className,
  location,
  onLocationChange
}: {
  className?: string
  location: MapLocation | null
  onLocationChange?: (l: MapLocation) => void
}) {
  const geocoder = useMemo(() => {
    return new google.maps.Geocoder()
  }, [])
  const latLng: google.maps.LatLngLiteral | null = location && {
    lat: location.latitude,
    lng: location.longitude
  }
  const onMapClick = async (e: google.maps.MapMouseEvent) => {
    const response = await geocoder.geocode({ location: e.latLng })
    const [{ address_components: components }] = response.results
    const city = components.find(x => x.types.includes('locality'))?.long_name ?? ''
    const state = components.find(x => x.types.includes('administrative_area_level_1'))?.long_name ?? ''
    onLocationChange?.({
      latitude: e.latLng?.lat() ?? 0,
      longitude: e.latLng?.lng() ?? 0,
      city,
      state
    })
  }
  return (
    <Map
      onClick={onMapClick}
      center={
        latLng ?? {
          lat: 39.960464, // middle of
          lng: -98.618606 // the USA
        }
      }
      zoom={latLng ? 9 : 4}
      className={className}
    >
      {location && <Marker position={latLng} />}
    </Map>
  )
}

const Map = ({ onClick, onIdle, children, className, ...options }: MapProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map>()

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}))
    }
  }, [ref, map])

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options)
    }
  }, [map, options])

  useEffect(() => {
    if (map) {
      ;['click', 'idle'].forEach(eventName => google.maps.event.clearListeners(map, eventName))
      if (onClick) map.addListener('click', onClick)
      if (onIdle) map.addListener('idle', () => onIdle(map))
    }
  }, [map, onClick, onIdle])

  return (
    <>
      <div ref={ref} className={className} />
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map })
        }
      })}
    </>
  )
}

const Marker = (options: google.maps.MarkerOptions) => {
  const [marker, setMarker] = useState<google.maps.Marker>()

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  useEffect(() => {
    if (marker) {
      marker.setOptions(options)
    }
  }, [marker, options])

  return null
}

const isLatLngLiteral = (obj: any) =>
  obj != null && typeof obj === 'object' && Number.isFinite(obj.lat) && Number.isFinite(obj.lng)

const deepCompareEqualsForMaps = createCustomEqual(deepEqual => (a: any, b: any) => {
  if (isLatLngLiteral(a) || a instanceof google.maps.LatLng || isLatLngLiteral(b) || b instanceof google.maps.LatLng) {
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
  }
  return deepEqual(a, b)
})

function useDeepCompareMemoize(value: any) {
  const ref = useRef()

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

function useDeepCompareEffectForMaps(callback: EffectCallback, dependencies: any[]) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize))
}
