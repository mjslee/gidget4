<template>
  <div id="app" class="columns">
    <!-- Code and Goals -->
    <div class="column">
      <GidgetCode
        ref="code"
        :value="code"
      />
      <GidgetGoals ref="goals" :world="world" :goals="goals" />
      <GidgetButtons
        ref="buttons"
        @click:explain="explainStep"
        @click:step="nextStep"
        @click:run="runSteps"
        @click:stop="stopScript"
      />
    </div>

    <!-- World and Dialogue -->
    <div class="column">
      <GidgetWorld
        ref="world" :world="world" :tiles="tiles"
        @update:selectedObject="updateSelectedObject"
      />
      <GidgetDialogue ref="dialogue" :dialogue="dialogue" />
    </div>

    <!-- Inspector -->
    <div class="column">
      <GidgetInspector :object="playerObject" />
      <GidgetInspector :object="selectedObject" />
    </div>
  </div>
</template>


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
    dialogue: { type: Object, default: () => {} },
    imports: { type: Object, default: () => {} },
  },


  watch: {
    /**
     * Update game world size on prop update.
     */
    size(newVal) {
      this.game.world.size = newVal;
    }
  },


  data() {
    return {
      // Editor and debugger
      data: {},

      // World
      game: Game.create({ size: this.size }),
      world: undefined,

      // World objects
      playerObject: undefined,
      selectedObject: undefined,
    }
  },


  created() {
    // Set up game
    this.game.onError = this.handleError;
    this.game.world.onObjectSay = this.handleMessages;

    // Create game objects
    this.game.createObjects(this.objects);

    // Watch world object
    this.world = this.game.world;
  },


  mounted() {
    this.playerObject = this.world.player;
    this.gidgetCode = this.$refs.code;
    this.gidgetDialogue = this.$refs.dialogue;
    this.gidgetGoals = this.$refs.goals;
    this.gidgetButtons = this.$refs.buttons;

    //this.gidgetDialogue.setMessages(this.dialogue);
  },


  methods: {
    /**
     * Update selected object property.
     */
    updateSelectedObject(payload) {
      this.selectedObject = payload;
    },


    /**
     * Handle object talking.
     */
    handleMessages(messages) {
      this.gidgetDialogue.messages = messages;
    },


    /**
     * Handle game error.
     */
    handleError(ln, message) {
      this.gidgetCode.reset();
      this.gidgetCode.setErrorLine(ln - 1);
      this.gidgetButtons.reset();
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
      this.gidgetButtons.reset();
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
      if (!this.gidgetButtons.isRunning) {
        // Reset and if evaluation fails then return
        this.game.reset();
        if (!this.evaluateScript())
          return;
        this.gidgetButtons.isRunning = true;
      }

      // Perform a step
      this.gidgetButtons.isBusy = true;
      const step = await this.game.step();

      // Enable button if the step has a next step
      if (step)
        this.gidgetButtons.isBusy = false;
    },


    /**
     * Run all steps.
     */
    async runSteps() {
      // Set running
      this.gidgetButtons.isRunning = true;
      this.gidgetButtons.isBusy = true;

      // Reset and run if evaluated
      this.game.reset();
      if (this.evaluateScript())
        await this.game.run();
    },
  }
}
</script>
