export const COMPONENT_STATUSES = ['operational', 'degraded', 'partial_outage', 'major_outage'] as const

export const INCIDENT_STATUSES = ['investigating', 'identified', 'monitoring', 'resolved'] as const

export const OVERALL_STATUSES = [
  'operational',
  'degraded',
  'partial_outage',
  'major_outage',
  'no_components',
] as const

export type ComponentStatus = (typeof COMPONENT_STATUSES)[number]
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number]
export type OverallStatus = (typeof OVERALL_STATUSES)[number]

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

export const OVERALL_STATUS_LABELS: Record<OverallStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  partial_outage: 'Partial Outage',
  major_outage: 'Major Outage',
  no_components: 'No Components',
}

// Tailwind classes for status badge background + text color
export const OVERALL_STATUS_COLORS: Record<OverallStatus, string> = {
  operational: 'bg-green-100 text-green-700',
  degraded: 'bg-yellow-100 text-yellow-700',
  partial_outage: 'bg-orange-100 text-orange-700',
  major_outage: 'bg-red-100 text-red-700',
  no_components: 'bg-gray-100 text-gray-500',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PAGE_DETAIL: '/pages/:id',
  PUBLIC_STATUS: '/status/:slug',
} as const
