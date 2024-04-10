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
  createScript(user, scriptRequest) {
    return api.post(`/api/scripts`, scriptRequest, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      },
      params: {
        userId: user.id
      }
    })
  },
  updateScript(id, scriptRequest, user) {
    return api.put(`/api/scripts/${id}`, scriptRequest, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
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
