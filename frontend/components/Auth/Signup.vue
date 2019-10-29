<template>
  <section>
    <!-- Button -->
    <button class="button is-primary is-medium" @click="isModalActive = true">
      Sign up
    </button>

    <!-- Modal -->
    <b-modal :active.sync="isModalActive" :width="640">
      <div class="modal-card" style="width: auto">

        <!-- Modal Header -->
        <header class="modal-card-head">
          <p class="modal-card-title">Sign up</p>
        </header>

        <!-- Modal Body -->
        <section class="modal-card-body">
          <div class="field is-grouped is-horizontal">
            <b-field label="E-mail" expanded>
              <b-input placeholder="E-mail" v-model="formData.email" />
            </b-field>

            <b-field label="Name" expanded>
              <b-input placeholder="Name" v-model="formData.name" />
            </b-field>
          </div>

          <div class="field is-grouped is-horizontal">
            <b-field label="Password" expanded>
              <b-input
                type="password"
                placeholder="Password"
                v-model="formData.password"
                password-reveal
              />
            </b-field>

            <b-field label="Confirm Password" expanded>
              <b-input
                type="password"
                placeholder="Confirm Password"
                v-model="formData.confirm_password"
                password-reveal
              />
            </b-field>
          </div>

          <div class="field is-grouped is-horizontal">
            <b-field label="Gender" expanded>
              <b-select placeholder="Gender" required expanded v-model="formData.gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="opt-out">Opt-Out</option>
              </b-select>
            </b-field>

            <b-field label="Age" expanded>
              <b-input placeholder="Age" v-model="formData.age" />
            </b-field>
          </div>

          <b-field label="Any Coding Experience?" expanded>
            <b-select
              required expanded
              placeholder="Any Coding Experience?"
              v-model="formData.has_coding_experience"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </b-select>
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
import { SIGNUP_ENDPOINT } from '@/constants/endpoints'


export default {
  data: () => ({
    isModalActive: false,

    formData: {
      email: '',
      name: '',
      password: '',
      confirm_password: '',
      gender: '',
      age: '',
      has_coding_experience: ''
    }
  }),

  methods: {
    submit() {
      /* axios call */
    }
  }
}
</script>
