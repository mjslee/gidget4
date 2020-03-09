<template>
  <div>

    <input
      type="range"
      min="0" :max="stepCount"
      v-on:change="$emit('step', activeStep)"
    />
      <!-- v&#45;model.number="activeStep" -->

    <span>{{ activeStep }}/{{ stepCount }}</span>

    <div class="buttons has-addons">

      <!-- Prev Step -->
      <b-button
        icon-left="chevron-left"
        :disabled="!hasPrev"
        @click="$emit('step', activeStep - 1)"
      />

      <!-- Next Step -->
      <b-button
        icon-left="chevron-right"
        :disabled="!hasNext"
        @click="$emit('step', activeStep + 1)"
      />

      <!-- Run -->
      <b-button
        icon-left="play"
        class="is-success"
        @click="$emit('run')"
        v-if="activeStep == 0"
      >
        Run
      </b-button>

      <!-- Stop -->
      <b-button
        icon-left="stop"
        class="is-danger"
        @click="$emit('stop')"
        v-else-if="!isComplete"
      >
        Stop
      </b-button>

      <!-- Reset -->
      <b-button
        icon-left="restart"
        class="is-warning"
        @click="$emit('reset')"
        v-else
      >
        Reset
      </b-button>

    </div>
  </div>
</template>


<script>
export default {

  props: {
    stepCount:  Number,
    activeStep: Number,
    isRunning:  Boolean
  },


  computed: {
    /**
     * Is there a previous step?
     *
     * @return {boolean}
     */
    hasPrev() {
      return this.activeStep > 0;
    },


    /**
     * Is there a next step?
     *
     * @return {boolean}
     */
    hasNext() {
      return this.stepCount == 0 || this.activeStep < this.stepCount;
    },


    /**
     * Can the player reset the game?
     *
     * @return {boolean}
     */
    isComplete() {
      return this.activeStep >= this.stepCount;
    },
  }

}
</script>
