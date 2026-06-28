import api from '@/api/axios'
import type { User } from '@/types'

export const loginUser = async (
  email: string,
  password: string
): Promise<{ accessToken: string; user: User }> => {
  const response = await api.post('/auth/login', { email, password })
  return response.data.data
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ accessToken: string; user: User }> => {
  const response = await api.post('/auth/register', { name, email, password })
  return response.data.data
}

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await api.post('/auth/refresh')
  return response.data.data
}
