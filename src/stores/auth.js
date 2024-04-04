import authService from '@/services/AuthService'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const blankUser = {
    username: '',
    accessToken: 'true',
    refreshToken: '',
    roles: []
  }
  const router = useRouter()

  const user = ref(blankUser)
  const logoutTimer = ref(0)
  const authError = ref('')

  watch(user, (user) => {
    axios.defaults.headers.common.Authorization = `Bearer ${user.accessToken}`

    if (!('accessToken' in user)) {
      return
    }

    try {
      const decodedToken = jwtDecode(user.accessToken)
      if (decodedToken.exp == null) {
        return
      }
      autoLogout(decodedToken.exp)
    } catch (error) {
      console.error('Failed to decode token', error)
    }
  })

  async function login(user) {
    try {
      const response = await authService.login(user)
      if (response.status === 200) {
        user.value = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return true // Login successful
      } else {
        return false // Login failed due to non-200 status code
      }
    } catch (error) {
      console.error('Error during login:', error)
      return false // Login failed due to an error
    }
  }

  function logout() {
    user.value = blankUser
    localStorage.removeItem('user')
    router.push({ name: 'login' })
  }

  async function loadFromLocalStorage() {
    const localUser = localStorage.getItem('user')
    if (localUser) {
      try {
        const parsedUser = JSON.parse(localUser)
        const isValidUser = Object.keys(blankUser).every((key) => key in parsedUser)

        if (isValidUser) {
          user.value = parsedUser
        } else {
          logout()
        }
      } catch (error) {
        logout()
      }
    }
  }
  loadFromLocalStorage()

  function autoLogout(expirationDate) {
    const currentDateInSeconds = Math.floor(Date.now() / 1000)
    const timeUntilExpiration = expirationDate - currentDateInSeconds

    window.clearTimeout(logoutTimer.value)

    logoutTimer.value = window.setTimeout(() => {
      logout()
    }, timeUntilExpiration * 1000)
  }

  return {
    user,
    authError,
    logout,
    login,
    loadFromLocalStorage
  }
})
