<template>
  <div class="card">
    <nuxt-link :to="`/play/${id}`">
      <section class="card-content">
        Level {{ number }}
      </section>
    </nuxt-link>
  </div>
</template>


<style scoped>
.card {
  display: inline-block;
}

.card-footer {
  margin-top: auto;
}
</style>


<script>
export default {
  props: {
    id:          Number,
    title:       String,
    description: String,
    number:      Number
  }
}
</script>
