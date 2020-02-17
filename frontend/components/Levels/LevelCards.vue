<template>
  <div class="columns is-multiline is-mobile">
    <div class="column is-one-quarter" v-for="row in rows" :key="row.id">
      <LevelCard :id="row.id" :title="row.title" :description="row.description" />
    </div>
  </div>
</template>


<script>
import { LEVELS } from '@/constants/endpoints';
import LevelCard from './LevelCard';


export default {
  components: {
    LevelCard
  },

  props: {

  },

  data() {
    return {
      columns: [
        { field: 'id' },
        { field: 'title' },
        { field: 'description' }
      ],
      rows: [],
    };
  },

  async mounted() {
    this.rows = await this.getLevels();
  },

  methods: {
    async getLevels() {
      const res = await this.$axios.$get(LEVELS);
      return res.data;
    }
  },
}
</script>
