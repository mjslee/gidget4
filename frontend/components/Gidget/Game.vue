<template>
  <div id="app" class="columns" v-if="game">
    <!-- Code and Goals -->
    <div class="column is-one-third">
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
      <div class="world">
        <world />
      </div>

      <Dialogue :messages="dialogue" />
    </div>

    <!-- Inspectors -->
    <div class="column">
      <object-inspector v-bind.sync="playerObject" v-if="playerObject" />
      <object-inspector v-bind.sync="selectedObject" v-if="selectedObject" />
    </div>
  </div>
</template>


<style>
.is-keyword     { color: #770088 !important }
.is-variable    { color: #0000ff !important }
.is-object      { color: #e47200 !important }
.is-object-dark { color: #000000 !important }
.is-boolean     { color: #221199 !important }
.is-integer     { color: #116644 !important }
.is-string      { color: #aa1111 !important }
</style>


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
    dialogue() {
      return this.$store.getters['game/getDialogue']
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
    }
  },


  data() {
    return {
      game: this.$store.getters['game/getGame'],
    }
  },


  mounted() {
    window.stepWait     = 100;
    window.stepDuration = 500;
  },


  methods: {
    /**
     * Runs the player's code.
     *
     * @return {boolean} True if runner is successful.
     */
    async runScript() {
      await this.$store.dispatch('game/resetGame');
      await this.$store.dispatch('game/runCode', this.$store.state.code.value);
      this.$emit('run');
    },

    /**
     * Resets the script and game.
     *
     * @return {void}
     */
    async resetScript() {
      await this.$store.dispatch('game/resetGame');
      this.$emit('reset');
    },

    /**
     * Stop/reset game script.
     *
     * @return {void}
     */
    async stopScript() {
      await this.$store.dispatch('game/resetGame');
      this.$emit('stop');
    },

    /**
     * Sequentially runs all steps.
     *
     * @return {void}
     */
    async runSteps() {
      if (!this.$store.state.game.isRunning)
        this.runScript();

      // Advance steps until isRunning is flagged to false or when a step
      // has an error.
      while (!this.$store.getters['game/isEvalComplete']) {
        await this.$store.dispatch('game/setStep',
          this.$store.state.game.activeStep + 1);

        await wait(window.stepWait);
      }
    },

    /**
     * Set step index.
     *
     * @param {number} index -- Step index to restore.
     * @return {boolean} True if a next step exists.
     */
    async setStep(index) {
      if (!this.$store.state.game.isRunning)
        await this.runScript();

      return await this.$store.dispatch('game/setStep', index);
    },
  }

}
</script>
