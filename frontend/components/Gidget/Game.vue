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
            @click:stop="stopScript(true)"
          />
        </div>
      </div>
    </div>

    <!-- World and Dialogue -->
    <div class="column">
      <div class="world">
        <GidgetWorld
          ref="world" :world="game.world" :tiles="tiles"
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
import GidgetWorld from './World';
import GidgetInspector from './Inspector';
import GidgetCode from './Code';
import GidgetDialogue from './Dialogue';
import GidgetGoals from './Goals';
import GidgetControls from './Controls';

import Game from '@/assets/gidget/game/gidget-game';


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
      game: Game.create({ size: this.size }),

      // World objects
      playerObject: undefined,
      selectedObject: undefined,
      selectedTile: undefined,
    }
  },


  created() {
    this.game.onStep = this.handleStep;
    this.game.onError = this.handleError;
    this.game.createObjects(this.objects);
    window.game = this.game;
  },


  mounted() {
    this.assignReferences();
  },


  methods: {
    /**
     * Assign variables that contain references to game objects.
     *
     * @return {void}
     */
    assignReferences() {
      this.game.world.messages = this.dialogue

      // Re-assign objects used by inspector
      this.playerObject = this.game.world.getObject('Gidget')
      if (this.selectedObject)
        this.selectedObject = this.game.world.getObject(this.selectedObject.id);
    },


    /**
     * Run script until it hits a breakpoint or ends.
     *
     * @param {number} sayMessage
     * @return {void}
     */
    async runScript(waitMilliseconds=50) {
      // Reset game
      this.stopScript();

      // Evaluate user code
      const evaluated = this.game.evaluate(this.$refs.code.code, this.imports);
      if (!evaluated)
        return false;

      // Set controls data
      this.$refs.controls.isRunning = true;
      this.$refs.controls.isBusy = true;
      this.$refs.controls.stepCount = this.game.stepper.steps.length - 1;

      return await this.game.run(waitMilliseconds);
    },


    /**
     * Stop stepper.
     *
     * @param {number} sayMessage
     * @return {void}
     */
    stopScript(sayMessage=false) {
      // Breaks object references
      this.game.reset();

      // Set the player object for inspector
      this.playerObject = this.game.world.getObject('Gidget')

      // Reset Vue components
      this.$refs.code.reset();
      this.$refs.controls.reset();
      this.$refs.goals.reset();

      // Re-assign references
      this.assignReferences();

      if (sayMessage)
        this.$refs.dialogue.text = "Ok, I'm stopping!"
    },


    /**
     * Restore previous step.
     *
     * @param {number} index -- Step index to restore.
     * @param {number} stepCount -- Amount of steps.
     * @return {void}
     */
    async setStep(index, stepCount) {
      if (!this.$refs.controls.isRunning)
        await this.runScript(0);

      this.$refs.controls.isBusy = true;
      await this.game.restore(index);
      this.$refs.controls.isBusy = false;

      // Re-assign references
      this.assignReferences();
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
      this.$refs.dialogue.text = message;
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
      this.$refs.code.setNextLine(step.hasNext ? step.nextStep.ln - 1 : -1);
      this.$refs.code.setActiveLine(step.ln - 1);

      // Set goals data and validate goals
      this.$refs.goals.setData(step.data);
      this.$nextTick(() => {
        this.$refs.goals.validate();
      })

      // Below this if-statement is ran on the final step
      if (step.hasNext)
        return;

      // Show red Xs on goals component
      this.$refs.goals.showFailures = true;
    },
  }
}
</script>
