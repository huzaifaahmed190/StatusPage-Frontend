import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { StatusPage, Component, Incident } from '@/types'

interface PublicState {
  page: StatusPage | null
  components: Component[]
  incidents: Incident[]
  isLoading: boolean
  error: string | null
}

const initialState: PublicState = {
  page: null,
  components: [],
  incidents: [],
  isLoading: false,
  error: null,
}

const publicSlice = createSlice({
  name: 'public',
  initialState,
  reducers: {
    setPublicData(
      state,
      action: PayloadAction<{ page: StatusPage; components: Component[]; incidents: Incident[] }>
    ) {
      state.page = action.payload.page
      state.components = action.payload.components
      state.incidents = action.payload.incidents
    },
    clearPublicData(state) {
      state.page = null
      state.components = []
      state.incidents = []
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const { setPublicData, clearPublicData, setLoading, setError } = publicSlice.actions

export default publicSlice.reducer
