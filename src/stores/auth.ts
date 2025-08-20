import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api' // axios configurado

// 📌 Tipos
interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  type: 'company' | 'client'
  name: string
  username: string
  email: string
  password: string
  password_confirmation: string
  // 👇 solo si es company
  company_name?: string
  company_email?: string
  nit?: string
  phone?: string
  address?: string
}

export const useAuthStore = defineStore('auth', () => {
  // 🔹 Hidratar user y token desde localStorage
  const user = ref<any>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const tokenFromStorage = localStorage.getItem('token')
  const token = ref<string | null>(tokenFromStorage || null)

  if (tokenFromStorage) {
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenFromStorage}`
  }

  // 🛠️ Helpers
  const setToken = (t: string) => {
    token.value = t
    localStorage.setItem('token', t)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  const setUser = (u: any) => {
    user.value = u
    localStorage.setItem('user', JSON.stringify(u))
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const getValidationErrors = (err: any): string => {
    if (err.response?.data?.errors) {
      return Object.values(err.response.data.errors).flat().join(', ')
    }
    return err.response?.data?.message || 'Unexpected error'
  }

  // 🔑 Login
  const login = async (payload: LoginPayload) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await api.post('/auth/login', payload)
      setToken(res.data.token)
      setUser(res.data.user)
      return res.data
    } catch (err: any) {
      error.value = getValidationErrors(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 🔑 Register
  const register = async (payload: RegisterPayload) => {
    isLoading.value = true
    error.value = null
    try {
      console.log('📤 Enviando payload:', payload)
      const res = await api.post('/auth/register', payload)
      console.log('✅ Respuesta backend:', res.data)

      // ❌ No logueamos automáticamente
      // setToken(res.data.token)
      // setUser(res.data.user)

      return res.data
    } catch (err: any) {
      if (err.response?.data?.errors) {
        error.value = Object.values(err.response.data.errors).flat().join(', ')
      } else {
        error.value = err.response?.data?.message || 'Register failed'
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 🔑 Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      console.warn('Logout failed', e)
    } finally {
      clearToken()
      clearUser()
    }
  }

  // 🔑 Fetch user (por si queremos refrescar datos del backend)
  const fetchUser = async () => {
    if (!token.value) return
    try {
      const res = await api.get('/auth/me')
      setUser(res.data)
    } catch (err) {
      clearToken()
      clearUser()
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchUser
  }
})
