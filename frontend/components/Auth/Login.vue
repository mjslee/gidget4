<template>
  <section>
    <!-- Button -->
    <button class="button is-primary is-medium" @click="isModalActive = true">
      Log in
    </button>

    <!-- Modal -->
    <b-modal :active.sync="isModalActive" :width="400">

        <b-loading
          :is-full-page="false"
          :active.sync="isLoading"
          :can-cancel="true"
        />
      <form @submit.prevent="submitForm" class="modal-card" style="width: auto">

        <!-- Modal Header -->
        <header class="modal-card-head">
          <p class="modal-card-title">Log in</p>
        </header>

        <!-- Modal Body -->
        <section class="modal-card-body">
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
    </b-modal>

  </section>
</template>


<style scoped>
.is-horizontal {
  margin-bottom: 0;
}
</style>


<script>
import { LOGIN_ENDPOINT } from '@/constants/endpoints'


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

      // Fetch response from signup endpoint
      try {
        const response = await this.$axios.post(LOGIN_ENDPOINT, this.formData)
      }

      // Set form errors
      catch (err) {
        const formErrors = _.get(err, 'response.data.errors')
        console.log(formErrors);

        if (typeof formErrors != 'undefined')
          this.formErrors = formErrors
      }

      // Not loading anymore
      finally {
        this.isLoading = false
      }
    }
  }
}
</script>
