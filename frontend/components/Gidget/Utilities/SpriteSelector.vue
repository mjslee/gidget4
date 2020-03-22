<template>
  <div>

    <!-- Search -->
    <b-field>
      <b-input placeholder="Search..." icon="magnify" v-model="search" />
    </b-field>

    <!-- Sprites -->
    <div class="columns is-centered is-multiline">
      <div v-for="sprite in filteredSprites" :key="sprite.title" class="column is-one-quarter">
        <b-tooltip :label="sprite.title">
          <button
            @click="$emit('input', sprite.title)"
            :class="value == sprite.title ? 'button is-primary is-active' : 'button'"
          >
            <figure class="image is-64x64">
              <img :src="sprite.src" :alt="sprite.title" />
            </figure>
          </button>
        </b-tooltip>
      </div>
    </div>

  </div>
</template>


<style scoped>
.button {
  height: auto;
}
</style>


<script>
export default {

  props: {
    value: {
      type: String
    },

    sprites: {
      type: Array
    },
  },

  data() {
    return {
      search: ''
    };
  },

  computed: {
    /**
     * Filtered sprites when search is used.
     *
     * @return {array}
     */
    filteredSprites() {
      if (typeof this.search == 'string' && this.search.length > 0)
        return this.sprites.filter(s => s.title.includes(this.search));
      else
        return this.sprites;
    }
  }

}
</script>
