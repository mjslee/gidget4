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
import Exception from '@/assets/gidget/lang/js-exception'
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
      game: Game.create(this.objects, {
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


  methods: {
    /**
     * Reset game script, components, and game object references.
     *
     * @return {void}
     */
    resetScript() {
      // Breaks object references
      this.game.reset()

      // Reset Vue components
      this.$refs.code.reset()
      this.$refs.controls.reset()
      this.$refs.goals.reset()
      this.$refs.dialogue.reset()
    },


    /**
     * Setup components and evaluate script.
     *
     * @return {void}
     */
    setupScript() {
      // Reset game
      this.resetScript()

      // Evaluate user code,
      const runner = this.game.run(this.$refs.code.code, this.imports)

      // Errors? No go
      if (runner.hasError)
        return false

      // Restore initial state, this stops the final positions from being
      // revealed since it is ran on the same Vue tick as 'run' above
      this.game.set(0, false)

      // Set up the controls
      this.$refs.controls.setup(runner.steps.length)

      return true
    },


    /**
     * Run all steps.
     *
     * @return {void}
     */
    async runScript() {
      const $controls = this.$refs.controls

      if (!$controls.isRunning)
        this.setupScript()

      while ($controls.hasNext) {
        const step = await this.game.set($controls.stepIndex)
        if (!step)
          return

        $controls.stepIndex += 1

        // Call step handler and wait the standard step wait time
        this.onStep(step)
        await wait(window.stepWait)
      }
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
     * Set step index.
     *
     * @param {number} index -- Step index to restore.
     * @return {void}
     */
    async setStep(index) {
      const $controls = this.$refs.controls
      $controls.stepIndex = index

      if (!$controls.isRunning)
        this.setupScript()

      const step = await this.game.set(index)
      if (!step)
        return

      this.onStep(step)
    },


    /**
     * Set line markers on step.
     *
     * @return {void}
     */
    onStep(step) {
      // Probably an error, remove active line
      if (_.isUndefined(this.$refs.code) || _.isUndefined(step)) {
        this.$refs.code.setActiveLine(-1)
        return
      }

      // Set code editor line
      this.$refs.code.setActiveLine(step.ln - 1)

      // Store data collected from game evaluation
      if (_.has(step, 'gameData'))
        this.$store.commit('evaldata/setData', step.gameData)
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

      if (!message)
        return;

      const translation = Exception.translate(message);
      this.$refs.dialogue.append({ text: translation || message });
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
        this.$refs.goals.completed() ?
          this.onSuccess() : this.onFailure();
      });
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
