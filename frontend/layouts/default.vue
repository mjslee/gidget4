<template>
  <div>
    <!-- Modals -->
    <portal-target name="modal" multiple />

    <!-- Popovers -->
    <portal-target name="popover" multiple />

    <!-- Header Bar -->
    <nav class="navbar header has-shadow is-primary">

      <div class="navbar-brand">
        <a class="navbar-item logo" href="/">
          Gidget
        </a>

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item" v-if="$auth.loggedIn">
          <div class="buttons">
            <a class="button is-primary">Log out</a>
          </div>
        </div>

        <div class="navbar-item" v-else>
          <div class="buttons">
            <a class="button is-primary">Sign up</a>
            <a class="button is-light">Log in</a>
          </div>
        </div>
      </div>

    </nav>

    <!-- Content -->
    <section class="main-content">

      <div class="container column is-12">
        <nuxt />
      </div>

    </section>
  </div>
</template>


<style scoped>
.logo {
  font-weight: bold;
  font-size: 1.5rem;
}
</style>


<script>
export default {
  data() {
    return { };
  }
}
</script>
