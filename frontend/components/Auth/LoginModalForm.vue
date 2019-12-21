<template>
  <!-- Modal -->
  <form @submit.prevent="submitForm" class="modal-card" style="width: auto">

    <!-- Modal Header -->
    <header class="modal-card-head">
      <p class="modal-card-title">Log in</p>
    </header>

    <!-- Modal Body -->
    <section class="modal-card-body">
      <b-loading
        :is-full-page="false"
        :active.sync="isLoading"
        :can-cancel="true"
      />

      <b-notification
        type="is-danger"
        v-for="(value, key) in formErrors"
        :key="key"
      >
        <p v-for="error in value" :key="error">{{ error }}</p>
      </b-notification>

      <b-field label="E-mail" expanded>
        <b-input
          v-model="formData.email"
          type="email"
          placeholder="E-mail"
          required
        />
      </b-field>

      <b-field label="Password" expanded>
        <b-input
          v-model="formData.password"
          type="password"
          placeholder="Password"
          password-reveal
          required
        />
      </b-field>
    </section>

    <!-- Modal Footer -->
    <section class="modal-card-foot">
      <b-button
        type="is-primary"
        native-type="submit"
        icon-right="chevron-right"
      >
        Continue
      </b-button>
    </section>

  </form>
</template>


<style scoped>
.is-horizontal {
  margin-bottom: 0;
}
</style>


<script>
import { AUTH_MESSAGES } from '@/constants/messages'


export default {
  data: () => ({
    isModalActive: false,
    isLoading: false,

    formErrors: {},
    formData: {
      email: 'a@a.com',
      password: 'a'
    }
  }),

  methods: {
    async submitForm() {
      this.isLoading = true
      const duration = AUTH_MESSAGES.TOAST_DURATION

      // Valid login
      try {
        const res = await this.$auth.loginWith('local', { data: this.formData })
        const message = AUTH_MESSAGES.LOGIN_SUCCESSFUL
        this.$buefy.toast.open({ message, duration, type: 'is-success' })
      }

      // Invalid login
      catch (err) {
        console.debug(err.response)

        let message = ''
        switch (_.get(err, 'response.status')) {
          case 401:
          case 422:
            message = AUTH_MESSAGES.INVALID_CREDENTIALS
            break

          default:
            message = AUTH_MESSAGES.UNKNOWN_EXCEPTION
            break
        }

        this.$buefy.toast.open({ message, duration, type: 'is-danger' })
      }

      finally {
        this.isLoading = false
      }

    }
  }
}
</script>
