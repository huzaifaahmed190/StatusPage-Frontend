export const COMPONENT_STATUSES = ['operational', 'degraded', 'partial_outage', 'major_outage'] as const

export const INCIDENT_STATUSES = ['investigating', 'identified', 'monitoring', 'resolved'] as const

export type ComponentStatus = (typeof COMPONENT_STATUSES)[number]
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number]

export const COMPONENT_STATUS_LABELS: Record<ComponentStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded Performance',
  partial_outage: 'Partial Outage',
  major_outage: 'Major Outage',
}

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PAGE_DETAIL: '/pages/:id',
  PUBLIC_STATUS: '/status/:slug',
} as const
