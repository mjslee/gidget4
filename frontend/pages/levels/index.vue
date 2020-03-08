<template>
  <div>
    <LevelCards :items="collections" />
  </div>
</template>


<script>
import LevelCards from '@/components/Levels/LevelCards';


export default {
  components: {
    LevelCards
  },

  props: {

  },

  data() {
    return {
      collections: [],
    };
  },

  async mounted() {
    const { data } = await this.$store.dispatch('collections/fetchCollections');
    this.collections = data;
  },
}
</script>
