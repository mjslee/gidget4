<template>
  <div class="buttons">
    <b-button
      icon-right="chevron-up"
      :disabled="upDisabled"
      @click="$emit('up')"
    />
    <b-button
      icon-right="chevron-down"
      :disabled="downDisabled"
      @click="$emit('down')"
    />
  </div>
</template>


<script>
export default {
  props: {
    disabled: Boolean,
    upDisabled: {
      type: Boolean,
      default: false
    },
    downDisabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
