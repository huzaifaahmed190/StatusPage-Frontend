import type { ComponentStatus, IncidentStatus, OverallStatus } from '@/constants'

export interface User {
  id: number
  name: string
  email: string
  createdAt?: string
}

export interface StatusPage {
  id: number
  user_id: number
  name: string
  slug: string
  overall_status: OverallStatus
  created_at: string
}

export interface Component {
  id: number
  page_id: number
  name: string
  status: ComponentStatus
  created_at: string
}

export interface IncidentUpdate {
  id: number
  incident_id: number
  message: string
  created_at: string
}

export interface Incident {
  id: number
  page_id: number
  title: string
  status: IncidentStatus
  created_at: string
  resolved_at: string | null
  updates?: IncidentUpdate[]
}

export interface ApiResponse<T> {
  statusCode: number
  data: T
  message: string
  success: boolean
}
