import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'

interface AuthState {
  accessToken: string | null
  user: User | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ accessToken: string; user: User }>) {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      state.error = null
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },
    clearCredentials(state) {
      state.accessToken = null
      state.user = null
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const { setCredentials, setAccessToken, clearCredentials, setLoading, setError } =
  authSlice.actions

export default authSlice.reducer
