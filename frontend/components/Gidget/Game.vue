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
        <GidgetDialogue ref="dialogue" :messages="game.world.messages" />
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
    this.game.onStep = this.handleStep;
    this.game.onError = this.handleError;
    this.game.onFinish = this.handleFinish;
  },


  mounted() {
    this.assignReferences();
    this.game.world.messages = this.dialogue;

    // Set game objects in code so components like Dialogue and Goals can
    // access these variables before any code is ran
    this.$store.commit('code/setObjects', this.game.world.getObjectClones());
    window.set = this.setStep;
  },


  methods: {
    /**
     * Assign variables that contain references to game objects.
     *
     * @return {void}
     */
    assignReferences() {
      // Re-assign objects used by inspector
      this.playerObject = this.game.world.getObject('Gidget')
      if (this.selectedObject)
        this.selectedObject = this.game.world.getObject(this.selectedObject.id);
    },


    /**
     * Reset game script, components, and game object references.
     *
     * @param {number} sayMessage
     * @return {void}
     */
    resetScript() {
      // Breaks object references
      this.game.reset();

      // Reset Vue components
      this.$refs.code.reset();
      this.$refs.controls.reset();
      this.$refs.goals.reset();

      // Re-assign references
      this.assignReferences();
    },


    /**
     * Setup components and evaluate script.
     *
     * @param {number} sayMessage
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
     * @param {number} sayMessage
     * @return {void}
     */
    async runScript() {
      if (this.setupScript())
        await this.game.run(50);
      this.$refs.controls.isBusy = false;
    },


    /**
     * Stop/reset game script.
     *
     * @param {number} sayMessage
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

      // Re-assign references
      this.assignReferences();
    },


    /**
     * Set line markers on step.
     *
     * @return {void}
     */
    handleStep(step) {
      // Set controls input range value
      this.$refs.controls.stepIndex = step.index;

      // Set code editor lines
      // THIS IS A MAJOR PERFORMANCE ISSUE, FIX THIS
      // this.$refs.code.setNextLine(step.hasNext ? step.nextStep.ln - 1 : -1);
      // this.$refs.code.setActiveLine(step.ln - 1);

      // Store objects inside step so no further object iterations happen
      if (typeof step.objects !== 'object')
        step.objects = this.game.world.getObjectClones();

      // Set goals data and validate goals
      this.$store.commit('code/setData', step.data);
      this.$store.commit('code/setObjects', step.objects);
    },


    /**
     * Handle game error.
     *
     * @return {void}
     */
    handleError(ln, message) {
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
    handleFinish() {
      // Show red Xs on goals component
      this.$refs.goals.showResults = true;
      this.$nextTick(() => {
        this.$refs.goals.completed() ?
          this.handleSuccess() :
          this.handleFailure();
      });
    },


    /**
     * Handle completion of goals.
     *
     * @return {void}
     */
    handleSuccess() {

    },


    /**
     * Handle non-completion of goals.
     *
     * @return {void}
     */
    handleFailure() {

    }
  }
}
</script>
