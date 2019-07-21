<template>
  <div>

    <input
      type="range"
      min="0" :max="stepCount"
      v-model.number="stepIndex"
      v-on:change="$emit('change:step', stepIndex)"
    />

    <span>{{ stepIndex }}/{{ stepCount }}</span>

    <div class="buttons has-addons">

      <!-- Prev Step -->
      <b-button
        icon-left="chevron-left"
        :disabled="!hasPrev"
        @click="$emit('change:step', --stepIndex)"
      />

      <!-- Next Step -->
      <b-button
        icon-left="chevron-right"
        :disabled="canReset"
        @click="$emit('change:step', ++stepIndex)"
      />

      <!-- Run -->
      <b-button
        icon-left="play"
        class="is-success"
        @click="$emit('click:run')"
        v-if="!isRunning"
      >
        Run
      </b-button>

      <!-- Stop -->
      <b-button
        icon-left="stop"
        class="is-danger"
        @click="$emit('click:stop')"
        v-else-if="!canReset"
      >
        Stop
      </b-button>

      <!-- Reset -->
      <b-button
        icon-left="restart"
        class="is-warning"
        @click="$emit('click:stop')"
        v-else
      >
        Reset
      </b-button>

    </div>
  </div>
</template>


<script>
export default {

  data() {
    return {
      isRunning: false,
      stepCount: 0,
      stepIndex: 0,
    }
  },


  computed: {
    /**
     * Is there a previous step?
     *
     * @return {boolean}
     */
    hasPrev() {
      return this.stepIndex > 0;
    },


    /**
     * Is there a next step?
     *
     * @return {boolean}
     */
    hasNext() {
      return this.stepIndex - 1 < this.stepCount
    },


    /**
     * Can the player reset the game?
     *
     * @return {boolean}
     */
    canReset() {
      return this.isRunning && this.stepIndex == this.stepCount;
    }
  },


  methods: {
    /**
     * Set up controls for a new script run.
     *
     * @return {void}
     */
    setup(stepCount) {
      this.isRunning = true
      this.stepCount = stepCount - 1
      this.stepIndex = 1
    },


    /**
     * Reset buttons to their initial state.
     *
     * @return {void}
     */
    reset() {
      this.isRunning = false
      this.stepCount = 0
      this.stepIndex = 0
    }
  }
}
</script>
