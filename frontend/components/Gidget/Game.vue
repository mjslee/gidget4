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
          :objects="game.world.objects"
          :tiles="tiles"
          :size="game.world.size"
          @change:object="selectedObject = arguments[0]"
          @change:tile="selectedTile = arguments[0]"
        />
      </div>

      <GidgetDialogue
        ref="dialogue"
        :messages="game.world.messages" />
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

import Game from '@/assets/gidget/game/gidget-game'
import JsException from '@/assets/gidget/lang/js-exception'
import { wait } from '@/assets/gidget/game/gidget-utility'

import { GIDGET_SPRITES } from '@/constants/paths'
import { GIDGET_MESSAGES } from '@/constants/messages'



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
    imports: { type: Array, default: () => [] },
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
      // World
      game: Game.create(this.objects, this.imports, {
        size: this.size,
        messages: this.dialogue
      }),

      // World objects
      playerObject: undefined,
      selectedObject: undefined,
      selectedTile: undefined,
    }
  },


  mounted() {
    window.stepWait = 100
    window.stepDuration = 500

    // Get important objects
    this.playerObject = this.game.world.getObject('Gidget');

    // Set game objects in code so components like Dialogue and Goals can
    // access these objects before any code is ran
    this.$store.commit('evaldata/setData', this.game.world.getObjectsSanitized())
  },


  beforeDestroy() {
    this.resetScript()
  },


  methods: {
    /**
     * Resets the script, game, and its components.
     *
     * @return {void}
     */
    resetScript() {
      // Reset game to defaults
      const step = this.game.reset()
      if (step)
        this.onStep(step)

      // Reset Vue components
      this.$refs.code.reset()
      this.$refs.controls.reset()
      this.$refs.goals.reset()
      this.$refs.dialogue.reset()
    },


    /**
     * Runs the user's code.
     *
     * @return {boolean} True if runner is successful.
     */
    runScript() {
      // Reset game
      this.resetScript()

      // Evaluate user code
      const runner = this.game.run(this.$refs.code.code)

      // Set up the controls
      if (typeof runner.steps == 'object')
        this.$refs.controls.setup(runner.steps.length)

      // Highlight errored line, if it exists
      if (typeof this.game.error == 'object')
        this.onError()

      return true
    },


    /**
     * Stop/reset game script.
     *
     * @return {void}
     */
    stopScript() {
      this.resetScript();
      this.$refs.dialogue.append({
        text: GIDGET_MESSAGES.STARTING_OVER,
        leftImage: GIDGET_SPRITES.STARTING_OVER
      })
    },


    /**
     * Sequentially runs all steps.
     *
     * @return {void}
     */
    async runSteps() {
      const $controls = this.$refs.controls

      // Run the script so we have access to the steps
      if (!$controls.isRunning)
        this.runScript()

      // TODO: Find a cleaner way to do this
      // Advance steps until isRunning is flagged to false or when a
      // step has an error.
      let index = 0
      while ($controls.isRunning && !$controls.isComplete) {
        await this.setStep(++index)
        await wait(window.stepWait)
      }
    },


    /**
     * Set step index.
     *
     * @param {number} index -- Step index to restore.
     * @return {boolean} True if a next step exists.
     */
    async setStep(index) {
      const $controls = this.$refs.controls
      $controls.stepIndex = index

      // If the script has not been ran/evaluated, we should evaluate it so
      // that we have access to its steps
      if (!$controls.isRunning)
        this.runScript()

      if ($controls.isComplete)
        this.onFinish()

      // Set the world state
      const step = await this.game.set(index)
      if (!step)
        return false

      // Handle the resulting step
      this.onStep(step)
    },


    /**
     * Set line markers on step.
     *
     * @return {void}
     */
    onStep(step) {
      // Probably an error, remove active line
      if (typeof this.$refs.code == 'undefined' || typeof step == 'undefined') {
        this.$refs.code.setActiveLine(-1)
        return
      }

      // Set code editor line
      this.$refs.code.setActiveLine(step.ln - 1)

      // Store data collected from game evaluation
      if (typeof step.gameData == 'object')
        this.$store.commit('evaldata/setData', step.gameData)
    },


    /**
     * Handle last step of stepper.
     *
     * @return {void}
     */
    onFinish() {
      if (typeof this.game.error == 'object')
        return this.onError()

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
        return

      const error = this.game.error

      if (typeof error.ln == 'number') {
        this.$refs.code.reset()
        this.$refs.code.setErrorLine(error.ln - 1)
      }

      if (typeof error.text == 'string') {
        this.$nextTick(() => {
          const text = JsException.translate(error.text) || error.text
          this.$refs.dialogue.append({ text })
        })
      }
    },


    /**
     * Handle completion of goals.
     *
     * @return {void}
     */
    onSuccess() {
      this.playerObject.image = GIDGET_SPRITES.SUCCESS
      this.$refs.dialogue.append({
        text: GIDGET_MESSAGES.SUCCESS,
        leftImage: this.playerObject.image
      })
    },


    /**
     * Handle non-completion of goals.
     *
     * @return {void}
     */
    onFailure() {
      this.playerObject.image = GIDGET_SPRITES.FAILURE
      this.$refs.dialogue.append({
        text: GIDGET_MESSAGES.FAILURE,
        leftImage: this.playerObject.image
      })
    }
  }
}
</script>
