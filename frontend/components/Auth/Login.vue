
<template>
  <section>

    <b-field>
      <b-input placeholder="E-mail" v-model="email" />
    </b-field>

    <b-field>
      <b-input placeholder="Password" v-model="password" password-reveal />
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
      password: ''
    }
  }
}
</script>
