<template>
  <div id="app">
    <div style="margin-bottom:2rem">
      <button @click="loadLvl">load lvl 1</button>
      <button @click="loadLvl2">load lvl 2</button>
    </div>
    <GidgetGame
      :key="updateKey"
      :code="game.code"
      :size="game.size"
      :tiles="game.tiles"
      :objects="game.objects"
      :goals="game.goals"
      :dialogue="game.dialogue"
      :imports="game.imports" />
  </div>
</template>


<script>
import GidgetGame from '@/components/Gidget/Game'
import lvl1 from '@/assets/gidget/game/levels/level1.json'
import lvl2 from '@/assets/gidget/game/levels/level2.json'


export default {
  name: 'app',
  components: {
    GidgetGame
  },


  data() {
    return {
      updateKey: 0,
      game: {}
    }
  },

  mounted() {
    this.loadLvl2();
  },

  methods: {
    loadLvl() {
      this.game = Object.create(lvl1);
      this.updateKey += 1;
    },
    loadLvl2() {
      this.game = Object.create(lvl2);
      this.updateKey += 1;
    }
  }
}
</script>
