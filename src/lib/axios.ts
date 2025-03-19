import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL,
  withCredentials: true,
})
