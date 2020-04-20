<template>
  <div id="app" class="columns" v-if="game">
    <!-- Code and Goals -->
    <div class="column is-one-third">
      <h1 class="title">Code</h1>

      <div class="card">
        <Code />

        <div class="card-footer"></div>
        <div class="card-content">
          <goals />
          <controls
            @step="setStep"
            @run="runSteps"
            @stop="stopScript"
            @reset="resetScript"
          />
        </div>
      </div>
    </div>

    <!-- World and Dialogue -->
    <div class="column">
      <h1 class="title">World</h1>

      <div class="world">
        <world />
      </div>

      <Dialogue />
    </div>

    <!-- Inspectors -->
    <div class="column">
      <object-inspector v-bind.sync="playerObject" v-if="playerObject" />
      <object-inspector v-bind.sync="selectedObject" v-if="selectedObject" />
    </div>
  </div>
</template>


<style scoped>
.world {
  margin-left: -1rem;
  margin-top: -1.25rem;
  padding-bottom: 1rem;
}
</style>


<script>
import Code from './Code/Code';
import World from './World';
import Goals from './Goals/Goals';
import Controls from './Controls/Controls';
import Dialogue from './Dialogue/Dialogue';
import ObjectInspector from './Objects/ObjectInspector';

import { wait } from '@/assets/gidget/game/gidget-utility';


export default {
  components: {
    Code,
    World,
    ObjectInspector,
    Dialogue,
    Goals,
    Controls
  },


  computed: {
    /**
     *
     */
    game() {
      return this.$store.getters['game/getGame'];
    },

    /**
     *
     */
    playerObject() {
      return this.$store.getters['objects/getObject'](
        (obj) => obj.name == 'Gidget'
      );
    },

    /**
     * 
     */
    selectedObject() {
      return this.$store.getters['objects/getSelected'];
    },

    /**
     * isRunning value from game state.
     *
     * @return {boolean}
     */
    isRunning() {
      return this.$store.state.game.isRunning;
    }
  },


  mounted() {
    window.stepWait     = 250;
    window.stepDuration = 100;
  },


  methods: {
    /**
     * Runs the player's code.
     *
     * @return {boolean} True if runner is successful.
     */
    async runScript() {
      await this.$store.dispatch('game/runCode', this.$store.state.code.value);
      this.$emit('run');
    },

    /**
     * Resets the script and game.
     *
     * @return {void}
     */
    resetScript() {
      this.$store.dispatch('game/resetGame');
      this.$emit('reset');
    },

    /**
     * Stop/reset game script.
     *
     * @return {void}
     */
    stopScript() {
      this.$store.dispatch('game/resetGame');
      this.$emit('stop');
    },

    /**
     * Sequentially runs all steps.
     *
     * @return {void}
     */
    async runSteps() {
      if (!this.isRunning)
        await this.runScript();

      // Advance steps until isEvaluating is false or when a step has an error.
      while (this.$store.getters['game/isEvaluating']) {
        await this.$store.dispatch('game/setStep', { relative: 1 });
        await wait(window.stepWait);
      }
    },

    /**
     * Set step index.
     *
     * @param {number} index -- Step index to restore.
     * @return {boolean} True if a next step exists.
     */
    setStep(index) {
      if (!this.isRunning)
        this.runScript();

      return this.$store.dispatch('game/setStep', { index });
    },
  }

}
</script>
