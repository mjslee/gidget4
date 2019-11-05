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

      <b-field label="Have Coding Experience?">
        <b-select v-model="formData.has_coding_experience" expanded>
          <option v-for="option in codingExperienceOptions" :key="option">
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
export default {
  props: {
    title: {
      type: String,
      default: 'Edit Profile'
    }
  },

  data: () => ({
    loading: false,
    genderOptions: [ 'Male', 'Female', 'Other' ],
    codingExperienceOptions: [ 'No', 'Yes' ],

    formData: {
      name: '',
      gender: '',
      age: 5,
      has_coding_experience: false
    }
  }),

  methods: {
    submitForm() {

    }
  }
}
</script>

<style>

</style>
