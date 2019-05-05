<template>
  <div>
    <button ref="explain" @click="$emit('click:explain')" :disabled='isBusy'>Explain Step</button>
    <button ref="step" @click="$emit('click:step')" :disabled='isBusy'>Next Step</button>
    <button ref="run" @click="$emit('click:run')" :disabled="isRunning">Run</button>
    <button ref="stop" @click="$emit('click:stop')">Stop</button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      // Button disabled states
      isRunning: false,
      isBusy: false,
    }
  },

  methods: {
    /**
     *
     */
    reset() {
      this.isRunning = false;
      this.isBusy = false;
    }
  }
}
</script>
