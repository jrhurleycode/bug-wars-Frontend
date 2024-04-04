<template>
  <Transition appear>
    <div id="login-box" class="login-box">
      <form id="login-form" @submit.prevent="login">
        <div id="fields">
          <div class="header-text">
            <h2>Login</h2>
            <h6 class="register-msg">
              Need an account?
              <RouterLink to="/register">Register here</RouterLink>
            </h6>
          </div>
          <!-- Username -->
          <div class="user-box">
            <span class="p-float-label">
              <InputText type="text" name="" required="" v-model="user.username" id="username" />
              <label for="username">Username</label>
            </span>
          </div>

          <!-- Password -->
          <div class="user-box">
            <span class="p-float-label">
              <Password
                type="password"
                name=""
                required=""
                v-model="user.password"
                id="password"
                toggleMask
                :feedback="false"
              />
              <label for="password">Password</label>
            </span>
          </div>

          <!-- Login button -->
          <div id="login-btn"><PrimeButton id="prime-button" label="Login" type="submit" /></div>
        </div>
      </form>
      <Toast />
    </div>
  </Transition>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import Toast from 'primevue/toast'
import PrimeButton from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  components: {
    Toast,
    PrimeButton,
    InputText,
    Password
  },

  methods: {
    async login() {
      const authStore = useAuthStore()

      try {
        const loginSuccess = await authStore.login(this.user)

        if (loginSuccess) {
          this.$toast.add({
            severity: 'success',
            summary: 'Login successful',
            detail: 'Login successful! Redirecting...',
            life: 3000
          })
          setTimeout(() => {
            this.$router.push({
              path: '/lobby'
            })
          }, 3000)
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'ERROR',
            detail: 'Invalid username or password.',
            life: 3000
          })
        }
      } catch (error) {
        console.error('Error during login:', error)
        this.$toast.add({
          severity: 'error',
          summary: 'ERROR',
          detail: 'An error occurred during login.',
          life: 3000
        })
      }
    }
  }
}
</script>

<style scoped>
#logo {
  border-radius: 150px;
  margin-bottom: 50px;
  border: solid rgba(255, 255, 255, 0) 1px;
}

#login-box {
  flex-direction: column;
  font-family: 'Michroma', sans-serif;
}

html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background: linear-gradient(#141e30, #243b55);
}

#fields {
  width: 400px;
  padding: 40px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h2 h6 {
  margin: 0;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
  width: 100%;
  padding: 15px;
  font-size: 16px;
  color: #fff;
}

#login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-enter-active,
.v-leave-active {
  transition:
    opacity 2s ease,
    transform 1s ease-in-out;
  transform: translateY(0px);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
</style>
