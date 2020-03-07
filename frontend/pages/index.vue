<template>
  <div>

    <section class="main">
      <div class="container">
        <div class="columns is-vcentered">

          <div class="column is-three-quarters">
            <img class="preload" src="/gidget/intro/landingHover.png" />
            <div class="gidget-and-friends" alt="Gidget and friends!" />
          </div>

          <div class="column">
            <div class="buttons">
              <b-button tag="router-link"
                to="/play"
                size="is-large"
                class="is-fullwidth"
                type="is-primary"
              >
                Play
              </b-button>
              <b-button
                tag="router-link"
                to="/levels"
                size="is-large"
                class="is-fullwidth"
              >
                Browse Levels
              </b-button>

              <b-button size="is-large" class="is-fullwidth" disabled>
                Level Editor
              </b-button>
              <b-button size="is-large" class="is-fullwidth">About</b-button>
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
  background-size: contain;
  height: 436px;
}

.gidget-and-friends:hover {
  background-image: url('/gidget/intro/landingHover.png');
}

.preload {
  display: none;
}
</style>


<script>
import Navbar from '@/components/Navbar'


export default {
  name: 'HomePage',
  layout: 'landing',

  components: {
    Navbar
  },
}
</script>
