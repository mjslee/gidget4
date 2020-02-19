<template>
  <div>
    <input
      :value="value" type="range" min="3" max="10"
      @input="$emit('input', parseInt($event.target.value))"
    />
  </div>
</template>


<script>
export default {
  props: {
    value: {
      type: Number,
      default: 3
    }
  }
}
</script>
