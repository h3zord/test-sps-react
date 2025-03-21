import axios, { isAxiosError } from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const status = error.response?.status
      const code = error.response?.data.error

      const accessTokenError =
        code === 'Token not found' || code === 'Invalid token'

      if (status === 401 && accessTokenError) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
