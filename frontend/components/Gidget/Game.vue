<template>
  <div id="app" class="columns" v-if="game && game.world">
    <!-- Code and Goals -->
    <div class="column is-one-third">
      <div class="card">
        <Code v-model="code"
          :activeLine="gameStore.activeLine"
          :errorLine="gameStore.errorLine"
          :previousActiveLine="gameStore.previousActiveLine"
          :previousErrorLine="gameStore.previousErrorLine"
          :isRunning="gameStore.isRunning"
        />

        <div class="card-footer"></div>
        <div class="card-content">
          <Goals ref="goals" :goals="gameStore.goals" @validate="$store.dispatch('game/validateGoals')" />
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
import Game from '@/assets/gidget/game/gidget-game';
import Code from './Code';
import World from './World';
import Goals from './Goals';
import Controls from './Controls';
import Dialogue from './Dialogue';
import Inspector from './Inspector';
import WorldSizeEditor from './Editor/WorldSizeEditor';
import ObjectEditor from './Editor/ObjectEditor';

import { wait } from '@/assets/gidget/game/gidget-utility';
import { GIDGET_SPRITES } from '@/constants/paths';
import { GIDGET_MESSAGES } from '@/constants/messages';
import JsException from '@/assets/gidget/lang/js-exception';


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
        return this.game.world.size;
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
  },


  mounted() {
    window.stepWait     = 100;
    window.stepDuration = 500;

    this.game = this.$store.state.game.gameState();
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
      this.$refs.dialogue.append({
        text:      GIDGET_MESSAGES.STARTING_OVER,
        leftImage: GIDGET_SPRITES.STARTING_OVER
      });
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
      while (!this.$store.getters['game/isComplete']) {
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

    /**
     * Handle last step of stepper.
     *
     * @return {void}
     */
    onFinish() {
      if (typeof this.game.error == 'object')
        return this.onError();

      // Show red Xs on goals component
      this.$refs.goals.showResults = true;
      this.$refs.goals.validate();

      // Call success or failure handler
      this.$nextTick(() => {
        this.$refs.goals.completed() ?
          this.onSuccess() :
          this.onFailure();
      });
    },

    /**
     * Handle game error.
     *
     * @return {void}
     */
    onError() {
      if (typeof this.game.error == 'undefined')
        return;

      const error = this.game.error;

      if (typeof error.ln == 'number') {
        this.$refs.code.setErrorLine(error.ln - 1);
      }

      if (typeof error.text == 'string') {
        this.$nextTick(() => {
          const text = JsException.translate(error.text) || error.text;
          this.$refs.dialogue.append({ text });
        });
      }
    },

    /**
     * Handle completion of goals.
     *
     * @return {void}
     */
    onSuccess() {
      if (typeof this.player == 'undefined')
        return;

      this.player.image = GIDGET_SPRITES.SUCCESS;
      this.$refs.dialogue.append({
        text: GIDGET_MESSAGES.SUCCESS,
        leftImage: this.player.image
      });
    },

    /**
     * Handle non-completion of goals.
     *
     * @return {void}
     */
    onFailure() {
      if (typeof this.player == 'undefined')
        return;

      this.player.image = GIDGET_SPRITES.FAILURE;
      this.$refs.dialogue.append({
        text: GIDGET_MESSAGES.FAILURE,
        leftImage: this.player.image
      });
    }
  }
}
</script>
