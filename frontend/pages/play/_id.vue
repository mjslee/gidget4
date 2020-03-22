<template>
  <div id="app">
    <!-- <h1 class="title">{{ game.title }}</h1> -->
    <!-- <h2 class="subtitle">{{ game.description }}</h2> -->

    <GidgetGame :key="$store.state.game.key" @run="onRun" />
  </div>
</template>


<script>
import GidgetGame from '@/components/Gidget/Game'
import GidgetLevels from '@/assets/gidget/game/levels'


export default {
  name: 'app',
  layout: 'default',

  components: {
    GidgetGame
  },

  computed: {
    id() {
      return this.$route.params.id;
    }
  },

  async created() {
    const data = await this.$store.dispatch('game/fetchLevel', { id: this.id });

    if (typeof data != 'undefined')
      await this.$store.dispatch('game/loadLevel', data);
  },

  methods: {
    onRun() {
      console.log('progress/updateProgress', {
        code: this.$store.state.code.value,
        data: JSON.stringify(this.$store.getters['game/getWorldState']),
        stepCount: this.$store.state.game.stepCount
      });
    }
  }
}
</script>
