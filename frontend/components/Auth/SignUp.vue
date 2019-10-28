<template>
  <section>

    <b-field>
      <b-input placeholder="E-mail" v-model="email" />
    </b-field>

    <b-field>
      <b-input placeholder="Name" v-model="name" />
    </b-field>

    <b-field>
      <b-input
        type="password"
        placeholder="Password"
        v-model="password"
        password-reveal
      />
    </b-field>

    <b-field>
      <b-input
        type="password"
        placeholder="Confirm Password"
        v-model="confirm_password"
        password-reveal
      />
    </b-field>

    <div class="field is-grouped is-horizontal">
      <b-field expanded>
        <b-select placeholder="Gender" required expanded v-model="gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="opt-out">Opt-Out</option>
        </b-select>
      </b-field>

      <b-field expanded>
        <b-datepicker placeholder="Birthday" />
      </b-field>
    </div>

    <b-field expanded>
      <b-select
        required expanded
        placeholder="Any Coding Experience?"
        v-model="has_coding_experience"
      >
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </b-select>
    </b-field>

    <div class="field is-grouped is-grouped-right">
      <b-button
        type="is-primary"
        size="is-medium"
        icon-right="chevron-right"
      >
        Continue
      </b-button>
    </div>

  </section>
</template>


<style scoped>
.is-horizontal {
  margin-bottom: 0;
}
</style>


<script>
export default {
  data() {
    return {
      email: '',
      name: '',
      password: '',
      confirm_password: '',
      gender: '',
      has_coding_experience: ''
    }
  }
}
</script>
