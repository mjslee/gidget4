<template>
  <div id="app">

    {{ level.title }}
    {{ level.description }}

    <GidgetGame
      :key="level.key"
      :initialCode="level.code"
      :initialSize="level.size"
      :initialTiles="level.tiles"
      :initialObjects="level.objects"
      :initialGoals="level.goals"
      :initialDialogue="level.dialogue"
      :initialImports="level.imports"
      :editorMode="true"
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
      updateKey: 0
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
