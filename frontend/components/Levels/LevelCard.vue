<template>
  <div class="card">

    <section class="card-content">
      <p class="title">
        {{ title }}
      </p>
      <p class="subtitle">
        {{ description }}
      </p>
    </section>

    <footer class="card-footer">
      <nuxt-link :to="`/play/${id}`" class="card-footer-item">
        Play
      </nuxt-link>
    </footer>

  </div>
</template>


<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-footer {
  margin-top: auto;
}
</style>


<script>
export default {
  props: {
    id: Number,
    title: String,
    description: String
  }
}
</script>
