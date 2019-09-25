<template>
  <div>

    <section class="hero">
      <div class="hero-body is-inline">
        <div class="container">
          <h1 class="title">Gidget</h1>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-three-quarters">
            <div class="gidget-and-friends" alt="Gidget and friends" />
              <!-- <img src="gidget/intro/landingDefault.png" alt="Gidget and friends" /> -->
            <div class="column">
              <b-button size="is-large" class="is-fullwidth">Play</b-button>
              <b-button size="is-large" class="is-fullwidth" disabled>Level Editor</b-button>
              <b-button size="is-large" class="is-fullwidth">About</b-button>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>


<style scoped>
html, body {
  background: #82af55;
}

.hero {
  background: #79cbe8;
}

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

export default {
  name: 'HomePage',
  layout: 'landing',

  components: {
    Navbar
  }
}
</script>
