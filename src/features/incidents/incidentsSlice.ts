import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Incident, IncidentUpdate } from '@/types'

interface IncidentsState {
  list: Incident[]
  isLoading: boolean
  error: string | null
}

const initialState: IncidentsState = {
  list: [],
  isLoading: false,
  error: null,
}

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setIncidents(state, action: PayloadAction<Incident[]>) {
      state.list = action.payload
    },
    addIncident(state, action: PayloadAction<Incident>) {
      state.list.unshift(action.payload)
    },
    updateIncident(state, action: PayloadAction<Incident>) {
      const index = state.list.findIndex((i) => i.id === action.payload.id)
      if (index !== -1) state.list[index] = action.payload
    },
    addIncidentUpdate(
      state,
      action: PayloadAction<{ incidentId: number; update: IncidentUpdate }>
    ) {
      const incident = state.list.find((i) => i.id === action.payload.incidentId)
      if (incident) {
        if (!incident.updates) incident.updates = []
        incident.updates.push(action.payload.update)
      }
    },
    clearIncidents(state) {
      state.list = []
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const {
  setIncidents,
  addIncident,
  updateIncident,
  addIncidentUpdate,
  clearIncidents,
  setLoading,
  setError,
} = incidentsSlice.actions

export default incidentsSlice.reducer
