<template>
  <div>

    <section class="main">
      <div class="container">
        <div class="columns is-vcentered">

          <div class="column is-three-quarters">
            <div class="gidget-and-friends" alt="Gidget and friends" />
          </div>

          <div class="column">
            <div class="buttons">
              <b-button
                size="is-large"
                class="is-fullwidth"
                type="is-primary"
              >
                Play
              </b-button>
              <b-button
                size="is-large"
                class="is-fullwidth"
                disabled
              >
                Level Editor
              </b-button>
              <b-button
                size="is-large"
                class="is-fullwidth"
              >
                About
              </b-button>
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>


<style scoped>
.gidget-and-friends {
  background: url('/gidget/intro/landingDefault.png') no-repeat;
  height: 436px;
}

.gidget-and-friends:hover {
  background-image: url('/gidget/intro/landingHover.png');
}
</style>


<script>
import Navbar from '@/components/Navbar'
import SignUp from '@/components/Auth/SignUp'
import LogIn from '@/components/Auth/LogIn'


export default {
  name: 'HomePage',
  layout: 'landing',

  components: {
    Navbar, SignUp, LogIn
  }
}
</script>
