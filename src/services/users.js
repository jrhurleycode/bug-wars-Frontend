import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_REMOTE_API
})

export default {
  getUsers() {
    return api.get(`/users/all`)
  },
  getUserById(id) {
    return api.get(`/users/${id}`)
  },
  getCurrentUser() {
    const authStore = useAuthStore()
    return authStore.user
  }
}
