import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { store } from '@/app/store'
import { router } from '@/router'
import AppInitializer from '@/components/shared/AppInitializer'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
      <Toaster position="top-right" richColors />
    </Provider>
  </StrictMode>
)
