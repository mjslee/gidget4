<template>
  <div>
    <input @change="$emit('update:size', $event.target.value)"
      type="range" min="3" max="10" :value="size" />
  </div>
</template>


<script>
export default {
  props: {
    size: {
      type: Number,
      default: 3
    }
  }
}
</script>
