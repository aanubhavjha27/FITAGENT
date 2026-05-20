import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: null,
  isLoggedIn: !!localStorage.getItem('token'),

  login: (token, user) => {
    localStorage.setItem('token', token)
    set({ token, user, isLoggedIn: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null, isLoggedIn: false })
  },

  setUser: (user) => set({ user }),
}))

export default useAuthStore