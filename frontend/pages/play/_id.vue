<template>
  <div id="app">

    <GidgetGame
      :key="updateKey"
      :initialCode="level.code"
      :initialSize="level.size"
      :initialTiles="level.tiles"
      :initialObjects="level.objects"
      :initialGoals="level.goals"
      :initialDialogue="level.dialogue"
      :initialImports="level.imports"
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

  async mounted() {
    await this.setLevel(this.id);
  },

  methods: {
    async setLevel(id) {
      await this.$store.dispatch('level/fetchAndLoad', { id });
      this.updateKey += 1;
    }
  }
}
</script>
