import api from '@/api/axios'
import type { StatusPage } from '@/types'

export const fetchPages = async (): Promise<StatusPage[]> => {
  const response = await api.get('/status-pages')
  return response.data.data
}

export const createPage = async (data: { name: string; slug: string }): Promise<StatusPage> => {
  const response = await api.post('/status-pages', data)
  return response.data.data
}

export const deletePage = async (pageId: number): Promise<void> => {
  await api.delete(`/status-pages/${pageId}`)
}