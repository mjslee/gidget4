<template>
  <div id="app" class="columns">
    <!-- Code and Goals -->
    <div class="column is-one-third">
      <div class="card">
        <GidgetCode
          ref="code"
          :value="code"
        />
        <div class="card-footer"></div>
        <div class="card-content">
          <GidgetGoals ref="goals" :world="game.world" :goals="goals" />
          <GidgetControls
            ref="controls"
            @change:step="setStep"
            @click:run="runScript"
            @click:stop="stopScript"
          />
        </div>
      </div>
    </div>

    <!-- World and Dialogue -->
    <div class="column">
      <div class="world">
        <GidgetWorld
          ref="world"
          :objects="game.world.objects"
          :tiles="tiles"
          :size="game.world.size"
          @change:object="selectedObject = arguments[0]"
          @change:tile="selectedTile = arguments[0]"
        />
      </div>

      <div class="box">
        <GidgetDialogue
          ref="dialogue"
          :messages="game.world.messages"
          @click:reset="resetDialogue"
        />
      </div>
    </div>

    <!-- Inspectors -->
    <div class="column">
      <GidgetInspector :object="playerObject" />
      <GidgetInspector :object="selectedObject || selectedTile" />
    </div>
  </div>
</template>


<style>
.is-keyword { color: #770088 !important }
.is-variable { color: #0000ff !important }
.is-object { color: #e47200 !important }
.is-object-dark { color: #000000 !important }
.is-boolean { color: #221199 !important }
.is-integer { color: #116644 !important }
.is-string { color: #aa1111 !important }
</style>


<style scoped>
.world {
  margin-left: -1rem;
  margin-top: -1.25rem;
  padding-bottom: 1rem;
}
</style>


<script>
import GidgetWorld from './World'
import GidgetInspector from './Inspector'
import GidgetCode from './Code'
import GidgetDialogue from './Dialogue'
import GidgetGoals from './Goals'
import GidgetControls from './Controls'

import Messages from '@/constants/messages'

import Game from '@/assets/gidget/game/gidget-game'
import Exception from '@/assets/gidget/lang/js-exception'
import { GIDGET_SUCCESS_IMAGE, GIDGET_FAILURE_IMAGE } from '@/constants/paths'



export default {
  components: {
    GidgetCode,
    GidgetWorld,
    GidgetInspector,
    GidgetDialogue,
    GidgetGoals,
    GidgetControls,
  },


  props: {
    code: { type: String, default: '' },
    size: { type: Number, default: 3 },
    tiles: { type: Array, default: () => [] },
    objects: { type: Array, default: () => [] },
    goals: { type: Array, default: () => [] },
    dialogue: { type: Array, default: () => [] },
    imports: { type: Object, default: () => {} },
  },


  watch: {
    /**
     * Update game world size on 'size' prop update.
     *
     * @param {number} value -- New world size.
     */
    size(value) {
      this.game.world.size = value;
    }
  },


  data() {
    return {
      // Editor and debugger
      data: {},

      // World
      game: Game.create(this.objects, { size: this.size }),

      // World objects
      playerObject: undefined,
      selectedObject: undefined,
      selectedTile: undefined,
    }
  },


  created() {
    this.game.onStep = this.onStep;
    this.game.onError = this.onError;
    this.game.onFinish = this.onFinish;
  },


  mounted() {
    // Get important objects
    this.playerObject = this.game.world.getObject('Gidget');

    // Set initial game dialogue
    this.resetDialogue();

    // Set game objects in code so components like Dialogue and Goals can
    // access these variables before any code is ran
    this.updateStoreData({});
  },


  methods: {
    /**
     * Reset game script, components, and game object references.
     *
     * @param {number} sayMessage
     * @return {void}
     */
    updateStoreData(data, objects) {
      if (typeof objects === 'undefined')
        objects = this.game.getObjectsMap();

      this.$store.commit('code/setData', data);
      this.$store.commit('code/setObjects', objects);
    },


    /**
     * Reset game world dialogue messages.
     *
     * @return {void}
     */
    resetDialogue() {
      this.game.world.messages = this.dialogue
    },


    /**
     * Reset game script, components, and game object references.
     *
     * @return {void}
     */
    resetScript() {
      // Breaks object references
      this.game.reset();

      // Reset Vue components
      this.$refs.code.reset();
      this.$refs.controls.reset();
      this.$refs.goals.reset();

      // Reset data
      this.updateStoreData({})
    },


    /**
     * Setup components and evaluate script.
     *
     * @return {void}
     */
    setupScript() {
      // Reset game
      this.resetScript(false);

      // Evaluate user code
      const evaluated = this.game.evaluate(this.$refs.code.code, this.imports);
      if (!evaluated)
        return false;

      // Set controls data
      this.$refs.controls.isRunning = true;
      this.$refs.controls.isBusy = true;
      this.$refs.controls.stepCount = this.game.stepper.steps.length;
      return true;
    },


    /**
     * Run all steps.
     *
     * @return {void}
     */
    async runScript() {
      if (this.setupScript())
        await this.game.run(75);
      this.$refs.controls.isBusy = false;
    },


    /**
     * Stop/reset game script.
     *
     * @return {void}
     */
    async stopScript() {
      this.resetScript();
      this.$refs.dialogue.text = Messages.Gidget.STARTING_OVER;
    },


    /**
     * Set step index.
     *
     * @param {number} index -- Step index to restore.
     * @return {void}
     */
    async setStep(index) {
      if (!this.$refs.controls.isRunning)
        this.setupScript(false);

      this.$refs.controls.isBusy = true;
      await this.game.set(index);
      this.$refs.controls.isBusy = false;
    },


    /**
     * Set line markers on step.
     *
     * @return {void}
     */
    onStep(step) {
      // Set controls input range value
      this.$refs.controls.stepIndex = step.index;

      // Set code editor lines
      this.$refs.code.setActiveLine(step.ln - 1);

      // Set data collected from evaluation
      this.updateStoreData(step.data, step.objectsMap);
    },


    /**
     * Handle game error.
     *
     * @return {void}
     */
    onError(ln, message) {
      this.$refs.code.reset();
      this.$refs.code.setErrorLine(ln - 1);
      this.$refs.controls.reset();

      const translation = Exception.translate(message,
        Messages.Exceptions.Translations);
      this.$refs.dialogue.text = translation || message;
    },


    /**
     * Handle last step of stepper.
     *
     * @return {void}
     */
    onFinish() {
      // Show red Xs on goals component
      this.$refs.goals.showResults = true;
      this.$refs.goals.validate();

      // Call success or failure handler
      this.$nextTick(() => {
        this.$refs.goals.completed() ? this.onSuccess() : this.onFailure();
      });
    },


    /**
     * Handle completion of goals.
     *
     * @return {void}
     */
    onSuccess() {
      this.playerObject.image = GIDGET_SUCCESS_IMAGE
    },


    /**
     * Handle non-completion of goals.
     *
     * @return {void}
     */
    onFailure() {
      this.playerObject.image = GIDGET_FAILURE_IMAGE
    }
  }
}
</script>
