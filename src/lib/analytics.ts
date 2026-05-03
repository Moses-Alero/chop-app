import type { AnalyticsEvent } from '../types/domain'

const analyticsStream: AnalyticsEvent[] = []

export function track(
  event: AnalyticsEvent['name'],
  payload: AnalyticsEvent['payload'],
): void {
  const entry: AnalyticsEvent = {
    name: event,
    payload,
    createdAt: new Date().toISOString(),
  }

  analyticsStream.push(entry)
  console.info('[analytics]', entry)
}

export function getAnalyticsStream(): AnalyticsEvent[] {
  return [...analyticsStream]
}
