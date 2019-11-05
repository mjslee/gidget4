<template>
  <div>
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
              <div class="navbar-end" v-if="$auth.loggedIn">
                <b-button @click="$auth.logout()">Log out</b-button>
                <b-button @click="showProfileForm">Edit Profile</b-button>
              </div>
              <div class="navbar-end" v-else>
                <b-button @click="showSignupForm">Sign up</b-button>
                <b-button @click="showLoginForm">Log in</b-button>
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
  </div>
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
import SignupModalForm from '@/components/Auth/SignupModalForm'
import LoginModalForm  from '@/components/Auth/LoginModalForm'
import ProfileModalForm  from '@/components/User/ProfileModalForm'


export default {
  components: {
    Navbar
  },

  data: () => ({
    items: [{
        title: 'Landing',
        icon: 'home',
        to: { name: 'landing' }
    }]
  }),

  methods: {
    /**
     *
     */
    launchModal(component, formProps) {
      this.$buefy.modal.open({
        parent: this,
        hasModalCard: true,
        component,
        formProps
      })
    },

    /**
     *
     */
    showSignupForm() {
      this.launchModal(SignupModalForm)
    },

    /**
     *
     */
    showLoginForm() {
      this.launchModal(LoginModalForm)
    },

    /**
     *
     */
    showProfileForm() {
      this.launchModal(ProfileModalForm)
    }
  }
}
</script>
