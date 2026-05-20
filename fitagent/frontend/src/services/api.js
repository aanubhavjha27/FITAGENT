import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const registerUser = async (data) => {
  const response = await api.post('/api/v1/auth/register', data)
  return response.data
}

export const loginUser = async (data) => {
  const response = await api.post('/api/v1/auth/login', data)
  return response.data
}

export const getMe = async () => {
  const response = await api.get('/api/v1/auth/me')
  return response.data
}

export const createProfile = async (data) => {
  const response = await api.post('/api/v1/profile/setup', data)
  return response.data
}

export const getMyProfile = async () => {
  const response = await api.get('/api/v1/profile/me')
  return response.data
}

export const generatePlan = async () => {
  const response = await api.post('/api/v1/chat/generate-plan')
  return response.data
}

export const getMyPlan = async () => {
  const response = await api.get('/api/v1/chat/my-plan')
  return response.data
}