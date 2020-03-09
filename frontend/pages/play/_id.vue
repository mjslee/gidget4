<template>
  <div id="app">
    <!-- <h1 class="title">{{ game.title }}</h1> -->
    <!-- <h2 class="subtitle">{{ game.description }}</h2> -->
    <b-checkbox v-model="editorMode">Editor Mode</b-checkbox>

    <GidgetGame
      :key="$store.state.game.key"
      :editorMode="editorMode"
      @run="onRun"
    />
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


  data() {
    return {
      editorMode: false,
      interval: undefined
    }
  },


  computed: {
    id() {
      return this.$route.params.id;
    }
  },


  mounted() {
    this.$store.dispatch('game/fetchAndLoad', { id: this.id });
    this.$store.dispatch('progress/fetchProgress', { levelId: this.id });

    this.interval = setInterval(() => {
      if (!document.hasFocus()) {
        this.$store.commit('game/setActivity', {
          key: 'inactiveSeconds', value: 5
        });
      }
    }, 5000);
  },

  destroyed() {
    clearInterval(this.interval);
  },

  methods: {
    onRun() {
      console.log('progress/updateProgress', {
        code: this.$store.state.game.code,
        data: JSON.stringify(this.$store.getters['game/getState']),
        stepCount: this.$store.state.game.stepCount
      });
    }
  }
}
</script>
