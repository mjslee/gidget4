<template>
  <main>

    <section class="hero">
      <div class="hero-head">
        <nav class="navbar">
          <div class="container">
            <div class="navbar-brand">
              <span class="navbar-burger burger" data-target="navbar">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbar" class="navbar-menu">
              <div class="navbar-end">
                <b-button>Sign up</b-button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div class="hero-body">
        <div class="container has-text-centered">
          <p class="title">
            Gidget
          </p>
          <p class="subtitle">&nbsp;</p>
        </div>
      </div>
    </section>

    <nuxt />

  </main>
</template>


<style>
html, body {
  background: #82af55;
}
</style>


<style scoped>
.hero {
  background: #79cbe8;
}
</style>


<script>
import Navbar from '@/components/Navbar'

export default {
  components: {
    Navbar
  },

  data() {
    return {
      items: [
        {
          title: 'Landing',
          icon: 'home',
          to: { name: 'landing' }
        }
      ]
    }
  }
}
</script>
