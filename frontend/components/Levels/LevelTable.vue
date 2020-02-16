<template>
  <div>
    <b-table
      :columns="columns"
      :data="rows"
    ></b-table>
  </div>
</template>


<script>
import { LEVELS } from '@/constants/endpoints';


export default {

  props: {

  },

  data() {
    return {
      columns: [
        {
          field: 'id'
        },
        {
          field: 'title'
        },
        {
          field: 'description'
        }
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
