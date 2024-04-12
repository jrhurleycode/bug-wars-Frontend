<template>
  <header>
    <div class="wrapper">
      <nav>
        <div class="left-links">
          <RouterLink class="link" to="/"> HOME </RouterLink>
          <RouterLink v-if="!tokenExists" class="link" to="/login"> LOGIN </RouterLink>
          <RouterLink v-if="tokenExists" class="link" to="lobby"> LOBBY </RouterLink>
          <RouterLink v-if="tokenExists" class="link" to="/script-editor">
            SCRIPT EDITOR
          </RouterLink>
        </div>
        
        <div class="right-links">
          <RouterLink v-if="!tokenExists" class="link" to="/register"> REGISTER </RouterLink>
          <RouterLink class="link" id="how-to-play" to="/how-to-play"> HOW TO PLAY </RouterLink>
          <div class="logout-route" @click="logout">
            <RouterLink v-if="tokenExists" class="link" to="/login"> LOGOUT </RouterLink>
          </div>

          <RouterLink class="link" id="credits" to="/credits"> CREDITS </RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

export default {
  methods: {
    logout() {
      const router = useRouter()
      useAuthStore(router).logout()
    }
  },
  computed: {
    tokenExists() {
      const authStore = useAuthStore()
      return authStore.$state.user.accessToken !== ''
    }
  }
}
</script>


<style >


#logo{
  border-radius: 200px;
}
body {
  background: linear-gradient(#141e30, #243b55);
  height: 200vh;
}

nav {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
}

.left-links {
  display: flex;
  justify-content: space-around;
  width: 450px;
}

.right-links {
  display: flex;
  justify-content: space-between;
  width: 450px;
}

.link {
  text-decoration: none;
  color: rgb(179, 179, 179);
  font-family: 'Michroma', sans-serif;
}

.link:hover {
  color: white;
}
</style>
