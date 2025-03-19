import { getToken } from '@/app/utils/storage'
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
