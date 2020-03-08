<template>
  <div v-if="typeof items != 'undefined'">
    <div class="box" v-for="(item, i) in items" :key="item.id">
      <h1 class="title">{{ item.title }}</h1>
      <h2 class="subtitle">{{ item.description }}</h2>
      <div class="card-container">
        <LevelCard
          :number="n+1"
          :key="`${i}-${n}`"
          v-for="(level, n) in item.levels.data"

          :id="level.id"
          :title="level.title"
          :description="level.description"
        />
      </div>
    </div>
  </div>
</template>


<style scoped>
.card-container {
  display: flex;
}

.card-container .card {
  min-width: 15rem;
  height: 10rem;
  margin: 0.75rem;
}
</style>


<script>
import LevelCard from './LevelCard';


export default {
  components: {
    LevelCard
  },

  props: {
    items: Array
  },

  data() {
    return {
      //
    };
  }
}
</script>
