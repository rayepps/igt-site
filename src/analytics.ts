import { Analytics as SegmentAnalytics } from '@segment/analytics-next'
import * as t from 'src/types'

const track = <T>(key: string, analytics: SegmentAnalytics, mapper: (arg: T) => any) => {
  return (data: T) => {
    analytics.track({
      event: key,
      type: 'track',
      properties: mapper(data)
    })
  }
}

const page = <T>(analytics: SegmentAnalytics) => {
  return (key: string, metadata: any = {}) => {
    analytics.page(key, metadata)
  }
}

export const makeAnalytics = (analytics: SegmentAnalytics) => ({
  track_event_viewed: track('user.viewed.event', analytics, (event: t.Event) => ({
    event_id: event.id,
    event_name: event.name,
    company_id: event.training.company.id,
    company_name: event.training.company.name,
    domain: new URL(event.training.company.directLink).hostname,
    training_id: event.training.id,
    training_name: event.training.name
  })),
  track_training_viewed: track('user.viewed.training', analytics, (training: t.Training) => ({
    company_id: training.company.id,
    company_name: training.company.name,
    domain: new URL(training.company.directLink).hostname,
    training_id: training.id,
    training_name: training.name
  })),
  track_alerts_subscription: track('user.subscribed.event-alerts', analytics, (data: { contact_id: string }) => data),
  track_dismiss_alerts_subscription: track('user.dismissed.event-alerts-prompt', analytics, (data: { contact_id: string | null }) => data),
  track_page: page(analytics),
  track_interactive_map_used: track('user.clicked.interactive-map', analytics, (state: string) => ({
    state
  }))
})

export type PraxisAnalytics = ReturnType<typeof makeAnalytics>

export default makeAnalytics
