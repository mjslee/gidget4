<template>
  <div id="app">
    <h1 class="title">{{ game.title }}</h1>
    <h2 class="subtitle">{{ game.description }}</h2>
    <b-checkbox v-model="editorMode">Editor Mode</b-checkbox>

    <GidgetGame
      :key="game.key"
      :editorMode="editorMode"
      :initialData="game.initialData"
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
      id: this.$route.params.id,
      editorMode: false,
      updateKey: 0,
    }
  },


  computed: {
    game() {
      return this.$store.state.game
    },
  },


  mounted() {
    this.setLevel(this.id);
  },


  methods: {
    setLevel(id) {
      this.$store.dispatch('game/fetchAndLoad', { id });
    }
  }
}
</script>
