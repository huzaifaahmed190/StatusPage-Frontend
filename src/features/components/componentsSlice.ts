import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Component } from '@/types'

interface ComponentsState {
  list: Component[]
  isLoading: boolean
  error: string | null
}

const initialState: ComponentsState = {
  list: [],
  isLoading: false,
  error: null,
}

const componentsSlice = createSlice({
  name: 'components',
  initialState,
  reducers: {
    setComponents(state, action: PayloadAction<Component[]>) {
      state.list = action.payload
    },
    addComponent(state, action: PayloadAction<Component>) {
      state.list.push(action.payload)
    },
    updateComponent(state, action: PayloadAction<Component>) {
      const index = state.list.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) state.list[index] = action.payload
    },
    clearComponents(state) {
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

export const { setComponents, addComponent, updateComponent, clearComponents, setLoading, setError } =
  componentsSlice.actions

export default componentsSlice.reducer
