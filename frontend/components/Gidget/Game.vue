<template>
  <div id="app">
    <GidgetCode 
      ref="code"
      :value="code"
      @click:explain="explainStep"
      @click:step="nextStep"
      @click:run="runSteps"
      @click:stop="stopScript"
    />

    <GidgetWorld 
      ref="world" :world="world" :tiles="tiles"
      @update:selectedObject="updateSelectedObject"
    />

    <br/>
    <GidgetInspector :object="playerObject" />

    <GidgetInspector :object="selectedObject" />

    <GidgetDialogue ref="dialogue" />

    <GidgetGoals ref="goals" :world="world" :goals="goals" />
  </div>
</template>


<script>
import GidgetWorld from './World';
import GidgetInspector from './Inspector';
import GidgetCode from './Code';
import GidgetDialogue from './Dialogue';
import GidgetGoals from './Goals';

import Game from '@/assets/gidget/game/gidget-game';


export default {
  components: {
    GidgetCode,
    GidgetWorld,
    GidgetInspector,
    GidgetDialogue,
    GidgetGoals,
  },


  props: {
    code: String,
    size: Number,
    tiles: Array[Object],
    objects: Array[Object],
    goals: Array[Object],
    imports: Object,
  },


  data() {
    return {
      // Editor and debugger
      data: {},

      // World
      world: undefined,
      setupData: {
        size: this.size,
        tiles: this.tiles,
        objects: this.objects
      },

      // World objects
      playerObject: undefined,
      selectedObject: undefined,
    }
  },


  created() {
    // Set up game
    this.game = Game.create({ size: this.size });
    this.game.onError = this.handleError;
    this.game.onStep = this.handleStep;
    this.game.world.size = 4;

    // Create game objects
    if (!window.objectsCreated)
      this.game.createObjects(this.objects);
    window.objectsCreated = true;

    // Watch world object
    this.world = this.game.world;
  },


  mounted() {
    this.playerObject = this.world.player;
    this.gidgetCode = this.$refs.code;
    this.gidgetDialogue = this.$refs.dialogue;
    this.gidgetGoals = this.$refs.goals;
  },


  methods: {
    /**
     * Update selected object property.
     */
    updateSelectedObject(payload) {
      this.selectedObject = payload;
    },


    /**
     * Handle game error.
     */
    handleError(ln, message) {
      this.gidgetCode.reset();
      this.gidgetCode.setErrorLine(ln - 1);
      this.gidgetDialogue.text = message;
    },


    /**
     * Set line markers on step.
     */
    handleStep(step) {
      this.gidgetCode.setActiveLine(step.ln - 1);
      this.gidgetCode.setNextLine(step.hasNext ? step.nextStep.ln - 1 : -1);
      this.gidgetGoals.setData(step.data);
    },


    /**
     * Run script until it hits a breakpoint or ends.
     */
    evaluateScript() {
      return this.game.evaluate(this.gidgetCode.code, this.imports);
    },


    /**
     * Stop stepper from executing and reset world.
     */
    stopScript() {
      this.game.reset();
      this.gidgetCode.reset();
    },


    /**
     * Run next step.
     */
    async nextStep() {
      if (!this.gidgetCode.isRunning) {
        // Reset and if evaluation fails then return
        this.game.reset();
        if (!this.evaluateScript())
          return;
        this.gidgetCode.isRunning = true;
      }

      // Perform a step
      this.gidgetCode.isBusy = true;
      const step = await this.game.step();
      
      // Enable button if the step has a next step
      if (step)
        this.gidgetCode.isBusy = false;
    },


    /**
     * Run all steps.
     */
    async runSteps() {
      // Set running
      this.gidgetCode.isRunning = true;
      this.gidgetCode.isBusy = true;

      // Reset and run if evaluated
      this.game.reset();
      if (this.evaluateScript())
        await this.game.run();
    },


    /**
     * Run all steps.
     */
    async explainStep() {
      if (this.evaluateScript())
        await this.game.explain();
    }
  }
}
</script>
