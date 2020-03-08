<template>
  <div id="app">
    <h1 class="title">{{ game.title }}</h1>
    <h2 class="subtitle">{{ game.description }}</h2>
    <b-checkbox v-model="editorMode">Editor Mode</b-checkbox>

    <GidgetGame
      :key="game.key"
      :editorMode="editorMode"
      :initialData="game.initialData"
      @run="runCode"
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
      updateKey:  0
    }
  },


  computed: {
    game() {
      return this.$store.state.game;
    },

    id() {
      return this.$route.params.id;
    }
  },


  mounted() {
    this.$store.dispatch('game/fetchAndLoad', { id: this.id });
    this.$store.dispatch('progress/fetchProgress', { levelId: this.id });
  },


  methods: {
    runCode({ code, data }) {
      this.$store.dispatch('progress/updateProgress', { code, data });
    }
  }
}
</script>
