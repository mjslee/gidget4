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
          <GidgetGoals ref="goals" :goals="goals" />
          <GidgetControls
            ref="controls"
            @change:step="setStep"
            @click:run="runSteps"
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
          :size="game.world.size"
          :objects="game.world.objects"
          :tiles="game.world.tiles"
          @selected="selected = arguments[0]"
        />
      </div>

      <template v-if="editorMode">
        <GidgetDialogue ref="dialogue" :messages="game.world.dialogue" />
      </template>
      <template v-else>
        <GidgetDialogue ref="dialogue" :messages="game.world.dialogue" />
      </template>
    </div>

    <!-- Inspectors -->
    <div class="column">
      <template v-if="editorMode">
        <GidgetObjectEditor :object="selected" />
        <GidgetWorldSizeEditor v-model="game.world.size" />
      </template>
      <template v-else>
        <GidgetInspector :object="player" />
        <GidgetInspector :object="selected" />
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
import GidgetCode from './Code';
import GidgetWorld from './World';
import GidgetGoals from './Goals';
import GidgetControls from './Controls';
import GidgetDialogue from './Dialogue';
import GidgetInspector from './Inspector';
import GidgetWorldSizeEditor from './Editor/WorldSizeEditor';
import GidgetObjectEditor from './Editor/ObjectEditor';
import { wait } from '@/assets/gidget/game/gidget-utility';
import { GIDGET_SPRITES } from '@/constants/paths';
import { GIDGET_MESSAGES } from '@/constants/messages';
import JsException from '@/assets/gidget/lang/js-exception';


export default {
  components: {
    GidgetCode,
    GidgetWorld,
    GidgetInspector,
    GidgetDialogue,
    GidgetGoals,
    GidgetControls,

    GidgetWorldSizeEditor,
    GidgetObjectEditor,
  },


  props: {
    editorMode:  { type: Boolean, default: false },
    initialData: { type: Object, default: () => {} },
  },


  watch: {
    /**
     * Update game world size on 'size' prop update.
     *
     * @param {number} value -- New world size.
     */
    size(value) {
      this.game.world.size = value;
    },

    /**
     * Update initial state on mode change.
     */
    editorMode() {
      this.game.updateInitialState();
    }

  },


  data() {
    const { code, size, tiles, objects, imports, goals, dialogue }
      = this.initialData;

    return {
      // Game Data
      code, goals,

      // Game World
      game: Game.create({ size, tiles, objects, imports, dialogue }),

      // World Objects
      player:   undefined,
      selected: undefined,
    }
  },


  mounted() {
    window.stepWait = 100;
    window.stepDuration = 500;
    window.game = this.game;

    // Get important objects
    this.player = this.game.world.getObject('Gidget');
    window.$store = this.$store;

    // Set game objects in code so components like Dialogue and Goals can
    // access these objects before any code is ran
    this.$store.commit('game/setEvalData', this.game.world.getObjectsSanitized());
  },


  beforeDestroy() {
    this.resetScript();
  },


  methods: {
    /**
     * Resets the script, game, and its components.
     *
     * @return {void}
     */
    resetScript() {
      // Reset game to defaults
      const step = this.game.reset();
      if (step)
        this.onStep(step);

      // Reset Vue components
      this.$refs.code.reset();
      this.$refs.controls.reset();
      this.$refs.goals.reset();
      this.$refs.dialogue.reset();
    },


    /**
     * Runs the user's code.
     *
     * @return {boolean} True if runner is successful.
     */
    runScript() {
      // Update initial game state in editor mode
      if (this.editorMode)
        this.game.updateInitialState();

      // Reset game
      this.resetScript();

      // Evaluate user code
      const runner = this.game.run(this.$refs.code.code);

      // Set up the controls
      if (typeof runner.steps == 'object') {
        if (runner.steps.length < 1)
          return false;

        this.$refs.controls.setup(runner.steps.length);
      }

      // Highlight errored line, if it exists
      if (typeof this.game.error == 'object')
        this.onError();

      return true;
    },


    /**
     * Stop/reset game script.
     *
     * @return {void}
     */
    stopScript() {
      this.resetScript();
      this.$refs.dialogue.append({
        text:      GIDGET_MESSAGES.STARTING_OVER,
        leftImage: GIDGET_SPRITES.STARTING_OVER
      });
    },


    /**
     * Sequentially runs all steps.
     *
     * @return {void}
     */
    async runSteps() {
      const $controls = this.$refs.controls;

      // Run the script so we have access to the steps
      if (!$controls.isRunning)
        this.runScript();

      // TODO: Find a cleaner way to do this
      // Advance steps until isRunning is flagged to false or when a
      // step has an error.
      let index = 0;
      while ($controls.isRunning && !$controls.isComplete) {
        await this.setStep(++index);
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
      const $controls = this.$refs.controls;
      $controls.stepIndex = index;

      // If the script has not been ran/evaluated, we should evaluate it so
      // that we have access to its steps
      if (!$controls.isRunning)
        this.runScript();

      if ($controls.isComplete)
        this.onFinish();

      // Set the world state
      const step = await this.game.set(index);
      if (!step)
        return false;

      // Handle the resulting step
      this.onStep(step);
    },


    /**
     * Set line markers on step.
     *
     * @return {void}
     */
    onStep(step) {
      // Probably an error, remove active line
      if (typeof this.$refs.code == 'undefined' || typeof step == 'undefined') {
        this.$refs.code.setActiveLine(-1);
        return;
      }

      // Set code editor line
      this.$refs.code.setActiveLine(step.ln - 1);

      // Store data collected from game evaluation
      if (typeof step.gameData == 'object')
        this.$store.commit('game/setEvalData', step.gameData);
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
        this.$refs.code.reset();
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
