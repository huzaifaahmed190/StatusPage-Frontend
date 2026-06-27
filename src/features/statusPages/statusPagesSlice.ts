import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { StatusPage } from '@/types'

interface StatusPagesState {
  list: StatusPage[]
  isLoading: boolean
  error: string | null
}

const initialState: StatusPagesState = {
  list: [],
  isLoading: false,
  error: null,
}

const statusPagesSlice = createSlice({
  name: 'statusPages',
  initialState,
  reducers: {
    setPages(state, action: PayloadAction<StatusPage[]>) {
      state.list = action.payload
    },
    addPage(state, action: PayloadAction<StatusPage>) {
      state.list.push(action.payload)
    },
    updatePage(state, action: PayloadAction<StatusPage>) {
      const index = state.list.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) state.list[index] = action.payload
    },
    removePage(state, action: PayloadAction<number>) {
      state.list = state.list.filter((p) => p.id !== action.payload)
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const { setPages, addPage, updatePage, removePage, setLoading, setError } =
  statusPagesSlice.actions

export default statusPagesSlice.reducer
