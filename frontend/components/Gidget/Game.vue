<template>
  <div id="app" class="columns" v-if="game && game.world">
    <!-- Code and Goals -->
    <div class="column is-one-third">
      <div class="card">
        <Code v-model="code" />

        <div class="card-footer"></div>
        <div class="card-content">
          <Goals
            :goals="gameStore.goals"
            @validate="$store.dispatch('game/validateGoals')"
          />
          <Controls ref="controls"
            :stepCount="gameStore.stepCount"
            :activeStep="gameStore.activeStep"
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
        <World ref="world"
          :size="worldSize"
          :objects="gameObjects"
          :tiles="gameTiles"
          @selected="selected = arguments[0]"
        />
      </div>

      <template v-if="editorMode">
        <Dialogue ref="dialogue" :messages="gameDialogue" />
      </template>
      <template v-else>
        <Dialogue ref="dialogue" :messages="gameDialogue" />
      </template>
    </div>

    <!-- Inspectors -->
    <div class="column">
      <template v-if="editorMode">
        <AddObjectButton />
        <ObjectEditor :object="selected" />
        <WorldSizeEditor v-model="worldSize" />
      </template>
      <template v-else>
        <Inspector :object="player" />
        <Inspector :object="selected" />
      </template>
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
import Code from './Code';
import World from './World';
import Goals from './Goals';
import Controls from './Controls';
import Dialogue from './Dialogue';
import Inspector from './Inspector';

import WorldSizeEditor from './Editor/WorldSizeEditor';
import ObjectEditor from './Editor/ObjectEditor';
import AddObjectButton from './Editor/AddObjectButton';

import { wait } from '@/assets/gidget/game/gidget-utility';


export default {
  components: {
    Code,
    World,
    Inspector,
    Dialogue,
    Goals,
    Controls,

    WorldSizeEditor,
    ObjectEditor,
    AddObjectButton
  },


  props: {
    editorMode: { type: Boolean, default: false },
  },

  computed: {
    /**
     *
     */
    gameStore() {
      return this.$store.state.game;
    },

    /**
     *
     */
    code: {
      get() {
        return this.gameStore.code;
      },
      set(value) {
        return this.$store.commit('game/setCode', value);
      }
    },

    /**
     *
     */
    worldSize: {
      get() {
        return this.$store.getters['game/getWorldSize'];
      },
      set(value) {
        return this.$store.commit('game/setWorldSize', value);
      }
    },

    /**
     *
     */
    gameObjects() {
      return this.game.world.objects;
    },

    /**
     *
     */
    gameTiles() {
      return this.game.world.tiles;
    },

    /**
     *
     */
    gameDialogue() {
      return this.game.world.dialogue
    },
  },


  data() {
    return {
      // Game World
      game: undefined,

      // World Objects
      player:   undefined,
      selected: undefined,
    }
  },

  created() {
    this.$store.dispatch('game/createGame');
    this.game = this.$store.state.game.gameState();
  },


  mounted() {
    window.stepWait     = 100;
    window.stepDuration = 500;
    //window.$store = this.$store

    this.player = this.$store.getters['game/getGidget']();
  },

  destroyed() {
    this.$store.dispatch('game/resetGame');
  },


  methods: {
    /**
     * Runs the player's code.
     *
     * @return {boolean} True if runner is successful.
     */
    async runScript() {
      await this.$store.dispatch('game/resetGame');
      await this.$store.dispatch('game/runCode');
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
      // Advance steps until isRunning is flagged to false or when a step
      // has an error.
      while (!this.$store.getters['game/isEvalComplete']) {
        await this.setStep(this.gameStore.activeStep + 1);
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
      if (!this.gameStore.isRunning)
        this.runScript();

      await this.$store.dispatch('game/setStepState', index);
    },
  }
}
</script>
