<template>
  <section>
    <!-- Button -->
    <button class="button is-primary is-medium" @click="isModalActive = true">
      Log in
    </button>

    <!-- Modal -->
    <b-modal :active.sync="isModalActive" :width="640">
      <div class="modal-card" style="width: auto">

        <!-- Modal Header -->
        <header class="modal-card-head">
          <p class="modal-card-title">Log in</p>
        </header>

        <!-- Modal Body -->
        <section class="modal-card-body">
          <b-field label="E-mail" expanded>
            <b-input placeholder="E-mail" v-model="formData.email" />
          </b-field>

          <b-field label="Password" expanded>
            <b-input
              type="password"
              placeholder="Password"
              v-model="formData.password"
              password-reveal
              />
          </b-field>
        </section>

        <!-- Modal Footer -->
        <section class="modal-card-foot">
          <b-button
            @click="submit"
            type="is-primary"
            icon-right="chevron-right"
          >
            Continue
          </b-button>
        </section>

      </div>
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

    formData: {
      email: '',
      password: ''
    }
  }),

  methods: {
    submit() {
      /* axios call */
    }
  }
}
</script>
