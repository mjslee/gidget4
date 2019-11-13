<template>
  <form @submit.prevent="submitForm" class="modal-card" style="width: auto">

    <!-- Modal Header -->
    <header class="modal-card-head">
      <p class="modal-card-title">{{ title }}</p>
    </header>

    <!-- Modal Body -->
    <main class="modal-card-body">
      <b-loading
        :is-full-page="false"
        :active.sync="loading"
        :can-cancel="true"
      />

      <b-field label="Name" expanded>
        <b-input
          v-model="formData.name"
          required
        />
      </b-field>

      <b-field label="Age" expanded>
        <b-numberinput
          v-model="formData.age"
          min="0"
          max="120"
          controls-position="compact"
          expanded
        />
      </b-field>

      <b-field label="Gender" expanded>
        <b-select v-model="formData.gender" expanded>
          <option v-for="option in genderOptions" :key="option">
            {{ option }}
          </option>
        </b-select>
      </b-field>
    </main>

    <!-- Modal Footer -->
    <footer class="modal-card-foot">
      <b-button
        type="is-primary"
        native-type="submit"
        icon-right="chevron-right"
      >
        Continue
      </b-button>
    </footer>

  </form>
</template>

<script>
import { UserEndpoints } from '@/constants/endpoints'
import { UserMessage } from '@/constants/messages'

export default {
  props: {
    title: {
      type: String,
      default: 'Edit Profile'
    }
  },

  mounted() {
    if (!this.$auth.loggedIn)
      this.$parent.close()
  },

  data() {
    const formData = {};
    const genderOptions = [ 'Male', 'Female', 'Other' ];

    const profile = _.get(this.$auth, 'user.profile')
    if (typeof profile != 'undefined') {
      formData.name = profile.name
      formData.gender = profile.gender
    }

    return { loading: false, genderOptions, formData }
  },

  methods: {
    async submitForm() {
      try {
        const res = await this.$axios.put(UserEndpoints.profile, this.formData)
        const message = UserMessages.profileUpdateSuccess
        this.$buefy.toast.open({ message })
      }
      catch (err) {

      }
    }
  }
}
</script>

<style>

</style>
