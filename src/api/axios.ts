import axios from 'axios'
import { store } from '@/app/store'
import { setAccessToken, clearCredentials } from '@/features/auth/authSlice'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  
  withCredentials: true, // sends httpOnly refresh token cookie automatically
})

// --- Request interceptor: attach access token to every request ---
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Response interceptor: handle 401 with token refresh + queue ---
// Why a queue? If 3 API calls fire at the same time and all get 401,
// without a queue all 3 would call /auth/refresh simultaneously.
// The queue ensures only ONE refresh happens, then all 3 requests retry.

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request and wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await api.post('/auth/refresh')
        const newToken = response.data.data.accessToken
        store.dispatch(setAccessToken(newToken))
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        store.dispatch(clearCredentials())
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
