<template>
  <button class="button is-primary is-medium" @click="logout">
    Logout
  </button>
</template>


<script>
import { AUTH_MESSAGES } from '@/constants/messages'

export default {
  methods: {
    async logout() {
      // Log user out
      try {
        await this.$auth.logout()
      }
      catch (err) {
        console.debug(err)
      }

      // Exception or not, the user will always be logged out
      finally {
        const message = AUTH_MESSAGES.LOGOUT_SUCCESSFUL
        const duration = AUTH_MESSAGES.TOAST_DURATION
        this.$buefy.toast.open({ message, duration, type: 'is-warning' })
      }
    }
  }
}
</script>
