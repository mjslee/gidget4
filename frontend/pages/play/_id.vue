<template>
  <div id="app">
    <h1 class="title">{{ level.title }}</h1>
    <h2 class="subtitle">{{ level.description }}</h2>
    <b-checkbox v-model="editorMode">Editor Mode</b-checkbox>

    <GidgetGame
      :key="level.key"
      :initialCode="level.code"
      :initialSize="level.size"
      :initialTiles="level.tiles"
      :initialObjects="level.objects"
      :initialGoals="level.goals"
      :initialDialogue="level.dialogue"
      :initialImports="level.imports"
      :editorMode="editorMode"
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
    level() {
      return this.$store.state.level
    }
  },


  mounted() {
    this.setLevel(this.id);
  },


  methods: {
    setLevel(id) {
      this.$store.dispatch('level/fetchAndLoad', { id });
    }
  }
}
</script>
