<template>
  <div class="buttons">
    <b-button icon-right="chevron-up" :disabled="disabled" @click="$emit('up')"></b-button>
    <b-button icon-right="chevron-down" :disabled="disabled" @click="$emit('down')"></b-button>
  </div>
</template>


<script>
export default {
  props: {
    disabled: Boolean
  }
}
</script>
