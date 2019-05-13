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
          <GidgetButtons
            ref="buttons"
            @click:explain="explainStep"
            @click:step="nextStep"
            @click:run="runSteps"
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
          @update:selectedObject="updateSelectedObject"
        />
      </div>

      <div class="box">
        <GidgetDialogue ref="dialogue" :messages="game.world.messages" />
      </div>
    </div>

    <!-- Inspectors -->
    <div class="column">
      <GidgetInspector :object="playerObject" />
      <GidgetInspector :object="selectedObject" />
    </div>
  </div>
</template>


<style>
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
import GidgetButtons from './Buttons';

import Game from '@/assets/gidget/game/gidget-game';


export default {
  components: {
    GidgetCode,
    GidgetWorld,
    GidgetInspector,
    GidgetDialogue,
    GidgetGoals,
    GidgetButtons,
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
    }
  },


  created() {
    this.game.onError = this.handleError;
    this.game.onStep = this.handleStep;
    this.game.createObjects(this.objects);
  },


  mounted() {
    this.assignReferences();
  },


  methods: {
    /**
     * Assign variables that contain references game objects.
     */
    assignReferences() {
      this.playerObject = this.game.world.getObject('Gidget')
      this.game.world.messages = this.dialogue
    },


    /**
     * Update selected object property.
     */
    updateSelectedObject(payload) {
      this.selectedObject = payload;
    },


    /**
     * Run script until it hits a breakpoint or ends.
     */
    evaluateScript() {
      return this.game.evaluate(this.$refs.code.code, this.imports);
    },


    /**
     * Stop stepper from executing and reset world.
     */
    stopScript(sayMessage=false) {
      // Breaks object references
      this.game.reset();

      // Set the player object for inspector
      this.playerObject = this.game.world.getObject('Gidget')

      // Reset Vue components
      this.$refs.code.reset();
      this.$refs.buttons.reset();

      if (sayMessage)
        this.$refs.dialogue.text = "Ok, I'm stopping!"
    },


    /**
     * Explain next step.
     */
    async explainStep() {
      if (this.evaluateScript())
        await this.game.explain();
    },


    /**
     * Run next step.
     */
    async nextStep() {
      if (!this.$refs.buttons.isRunning) {
        // Reset and if evaluation fails then return
        this.stopScript();
        if (!this.evaluateScript())
          return;
        this.$refs.buttons.isRunning = true;
      }

      // Perform a step
      this.$refs.buttons.isBusy = true;
      const hasNextStep = await this.game.step();

      // Enable button if the step has a next step
      if (hasNextStep)
        this.$refs.buttons.isBusy = false;
    },


    /**
     * Run all steps.
     */
    async runSteps() {
      // Set running
      this.$refs.buttons.isRunning = true;
      this.$refs.buttons.isBusy = true;

      // Reset and run if evaluated
      this.stopScript();
      if (this.evaluateScript())
        await this.game.run();
    },


    /**
     * Handle game error.
     */
    handleError(ln, message) {
      this.$refs.code.reset();
      this.$refs.code.setErrorLine(ln - 1);
      this.$refs.buttons.reset();
      this.$refs.dialogue.text = message;
    },


    /**
     * Set line markers on step.
     */
    handleStep(step) {
      this.$refs.code.setActiveLine(step.ln - 1);
      this.$refs.code.setNextLine(step.hasNext ? step.nextStep.ln - 1 : -1);
      this.$refs.goals.setData(step.data);
    },
  }
}
</script>
