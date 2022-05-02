import { useState, useEffect } from 'react'
import createAnalytics, { PraxisAnalytics } from 'src/analytics'
import { Analytics, AnalyticsBrowser } from '@segment/analytics-next'
import storage from 'src/local-storage'
import config from 'src/config'

declare global {
  interface Window {
    px_segment_analytics: Analytics
  }
}

const load = async (): Promise<Analytics | null> => {
  if (storage.skipAnalytics.get() === true) {
    return null
  }
  if (!config.segmentKey) {
    console.warn('FIXME: No segment key configured')
    return null
  }
  if (window?.px_segment_analytics?.initialized === true) {
    return window.px_segment_analytics
  }
  const [analytics] = await AnalyticsBrowser.load({ writeKey: config.segmentKey })
  window.px_segment_analytics = analytics
  return analytics
}

export const useAnalytics = (): PraxisAnalytics | null => {
  const [analytics, setAnalytics] = useState<PraxisAnalytics | null>(null)
  useEffect(() => {
    load().then(a => {
      if (!a) return
      setAnalytics(createAnalytics(a))
    })
  }, [])
  return analytics
}

export default useAnalytics
