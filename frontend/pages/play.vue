<template>
  <div id="app">
    <div style="margin-bottom:2rem">
      <nav class="pagination is-large">
        <ul class="pagination-list" v-if="levels.length > 0">
          <li v-for="index in levels.length" :key="index">
            <a
              :class="'pagination-link' + (index - 1 == levelIndex ? ' is-current' : '')"
              @click="loadLevel(index-1)"
            >
              {{ index }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <GidgetGame
      :key="updateKey"
      :code="level.code"
      :size="level.size"
      :tiles="level.tiles"
      :objects="level.objects"
      :goals="level.goals"
      :dialogue="level.dialogue"
      :imports="level.imports"
    />
  </div>
</template>


<script>
import GidgetGame from '@/components/Gidget/Game'
import GidgetLevels from '@/assets/gidget/game/levels'

export default {
  name: 'app',
  components: {
    GidgetGame
  },


  data() {
    return {
      updateKey: 0,

      level: {},
      levelIndex: 0,
      levels: [],
    }
  },


  mounted() {
    this.setLevels(GidgetLevels.Gidget3, 0)
  },


  methods: {
    /**
     * Sets levels and loads a level by its index..
     *
     * @param {array[object]} levels - Array of levels.
     * @param {number} index - Level index to load.
     */
    setLevels(levels, index) {
      this.levels = levels
      this.loadLevel(index)
    },

    /**
     * Loads a level by index.
     *
     * @param {number} index - Level index to load.
     */
    loadLevel(index) {
      // Attempt to get level object
      const level = this.levels[index]
      if (typeof level == 'undefined')
        return false

      // Create level object
      this.level = Object.create(level)
      this.levelIndex = index

      // Increment update key to re-initalize the GidgetGame component
      this.updateKey += 1

      return true
    },
  }
}
</script>
