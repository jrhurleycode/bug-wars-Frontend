import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_REMOTE_API
})

export default {
  getUserScripts(user) {
    return api.get(`/api/scripts`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      },
      params: {
        userId: user.id
      }
    })
  },

  getScriptById(id, user) {
    return api.get(`/api/scripts/${id}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      },
      params: {
        userId: user.id
      }
    })
  },
  createScript(user, script) {
    return api.post(`/api/scripts`, script, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      },
      params: {
        userId: user.id
      }
    })
  },
  updateScript(script, user) {
    return api.put(`/api/scripts/${script.id}`, script, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      },
      params: {
        userId: user.id
      }
    })
  },
  deleteScript(id, user) {
    return api.delete(`/api/scripts/${id}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      },
      params: {
        userId: user.id
      }
    })
  }
}
