import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import statusPagesReducer from '@/features/statusPages/statusPagesSlice'
import componentsReducer from '@/features/components/componentsSlice'
import incidentsReducer from '@/features/incidents/incidentsSlice'
import publicReducer from '@/features/public/publicSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    statusPages: statusPagesReducer,
    components: componentsReducer,
    incidents: incidentsReducer,
    public: publicReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
