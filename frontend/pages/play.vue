<template>
  <div id="app">
    <div style="margin-bottom:2rem">
      <nav class="pagination is-large" role="navigation" aria-label="pagination">
        <ul class="pagination-list">
          <li v-for="index in levels.length" :key="index">
            <a class="pagination-link" @click="loadLevel(index)">{{ index }}</a>
          </li>
        </ul>
      </nav>
    </div>

    <GidgetGame
      :key="updateKey"
      :code="game.code"
      :size="game.size"
      :tiles="game.tiles"
      :objects="game.objects"
      :goals="game.goals"
      :dialogue="game.dialogue"
      :imports="game.imports"
    />
  </div>
</template>


<script>
import GidgetGame from '@/components/Gidget/Game'
import lvl1 from '@/assets/gidget/game/levels/level1.json'
import lvl2 from '@/assets/gidget/game/levels/level2.json'
import lvl3 from '@/assets/gidget/game/levels/level3.json'
import lvl4 from '@/assets/gidget/game/levels/level4.json'
import lvl5 from '@/assets/gidget/game/levels/level5.json'
import lvl6 from '@/assets/gidget/game/levels/level6.json'
import lvl7 from '@/assets/gidget/game/levels/level7.json'
import lvl8 from '@/assets/gidget/game/levels/level8.json'
import lvl9 from '@/assets/gidget/game/levels/level9.json'
import lvl10 from '@/assets/gidget/game/levels/level10.json'


export default {
  name: 'app',
  components: {
    GidgetGame
  },


  data() {
    return {
      levels: [ lvl1, lvl2, lvl3, lvl4, lvl5, lvl7, lvl7, lvl8, lvl9, lvl10 ],
      currentLevel: 0,

      updateKey: 0,
      game: {}
    }
  },

  mounted() {
    this.loadLevel(2)
  },

  methods: {
    loadLevel(index) {
      const level = this.levels[index - 1]
      this.game = Object.create(level)
      this.updateKey += 1
    },
  }
}
</script>
