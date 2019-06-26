<template>
  <div class="buttons has-addons">

    <input
      type="range"
      min="0" :max="stepCount"
      v-model.number="internalIndex"
      v-on:change="$emit('change:step', stepIndex)"
    />

    <p>
      {{ internalIndex }}/{{ stepCount }}
    </p>

    <div class="buttons has-addons">
      <b-button
        ref="prevStep"
        icon="chevron-left"
        class="button"
        :disabled="canPrev"
        @click="$emit('change:step', --stepIndex)"
      >
        <b-icon icon="chevron-left"></b-icon>
      </b-button>

      <b-button
        ref="nextStep"
        class="button"
        :disabled="canReset"
        @click="$emit('change:step', ++stepIndex)"
      >
        <b-icon icon="chevron-right"></b-icon>
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
  </div>
</template>


<script>
export default {
  data() {
    return {
      stepCount: 0,
      stepIndex: -1,
      isRunning: false,
      isBusy: false
    }
  },


  computed: {
    /**
     * Add one to stepIndex to represent initial state and every other step.
     * Subtract one to get correct step index.
     *
     * @return {number}
     */
    internalIndex: {
      get() {
        return this.stepIndex + 1
      },

      set(newValue) {
        this.stepIndex = newValue - 1;
      },
    },


    /**
     * Determine if previous step is possible.
     *
     * @return {boolean}
     */
    canPrev() {
      return this.isBusy || !this.isRunning || this.internalIndex <= 0;
    },


    /**
     * Controls can be reset.
     *
     * @return {boolean}
     */
    canReset() {
      return this.stepCount > 0 && this.internalIndex >= this.stepCount;
    },


    /**
     * Class for toggle button.
     *
     * @return {string}
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
     * @return {string}
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
     *
     * @return {void}
     */
    reset() {
      this.isRunning = false;
      this.isBusy = false;

      this.stepIndex = -1;
      this.stepCount = 0;
    },


    /**
     * Emit signal to stop or run game evaluation.
     *
     * @return {void}
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
