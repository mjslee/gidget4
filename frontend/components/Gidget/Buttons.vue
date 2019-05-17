<template>
  <div class="buttons has-addons">

    <p>
      {{ stepIter }}/{{ stepCount }}
    </p>

    <b-button
      ref="previousStep"
      class="button"
      :disabled='isBusy || stepIter == 0'
      @click="$emit('click:previousStep')"
    >
      Prev Step
    </b-button>

    <b-button
      ref="nextStep"
      class="button"
      :disabled='isBusy'
      @click="$emit('click:nextStep')"
    >
      Next Step
    </b-button>

    <b-button
      ref="toggle"
      :icon-left="toggleIcon"
      :class="toggleClass"
      @click="toggle"
    >
      {{ toggleText }}
    </b-button>

  </div>
</template>


<script>
export default {
  data() {
    return {
      stepCount: 0,
      stepIter: 0,
      canReset: false,
      isRunning: false,
      isBusy: false
    }
  },


  computed: {
    /**
     *
     */
    previousStepDisabled() {
      if (this.stepIter < 1)
        return true;

      return this.isRunning && !this.canReset;
    },

    /**
     * Class for toggle button.
     *
     * @return string
     */
    toggleClass() {
      let result = 'button '
      if (this.canReset)
        result += 'is-warning'

      else if (this.isRunning)
        result += 'is-danger'

      else
        result += 'is-success'

      return result;
    },


    /**
     * Text for toggle button.
     *
     * @return string
     */
    toggleText() {
      if (this.canReset)
        return 'Reset'

      else if (this.isRunning)
        return 'Stop'

      else
        return 'Run'
    },


    /**
     * MDI icon string for toggle button.
     *
     * @return string
     */
    toggleIcon() {
      if (this.canReset)
        return 'restart'

      else if (this.isRunning)
        return 'stop'

      else
        return 'play'
    }
  },


  methods: {
    /**
     * Reset buttons to their initial state.
     */
    reset() {
      this.canReset = false;
      this.isRunning = false;
      this.isBusy = false;

      this.stepIter = 0;
      this.stepCount = 0;
    },


    /**
     * Emit signal to stop or run game evaluation.
     */
    toggle() {
      // Not running? Run it
      if (!this.isRunning)
        this.$emit('click:run');

      // It is running so stop it
      else
        this.$emit('click:stop');
    }
  }
}
</script>
