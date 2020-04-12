<template>
  <article>
    <!-- Search -->
    <b-field>
      <b-input placeholder="Search..." icon="magnify" v-model="searchQuery" />
    </b-field>

    <!-- Sprites -->
    <section class="columns is-multiline is-mobile">
      <div v-for="sprite in filteredSprites" :key="sprite.title" class="column is-one-quarter">
        <b-tooltip :label="sprite.title">
          <button
            @click="newValue = sprite.title"
            :class="newValue == sprite.title ? 'button is-primary is-active' : 'button'"
          >
            <figure class="image is-64x64">
              <img :src="sprite.src" :alt="sprite.title" />
            </figure>
          </button>
        </b-tooltip>
      </div>
    </section>

  </article>
</template>


<style scoped>
article {
  overflow-x: hidden;
}

.button {
  height: auto;
}

.columns {
  overflow: visible;
  max-height: 20rem;
  width: 100%;
}

.column {
  text-align: center;
}
</style>


<script>
export default {

  props: {
    value   : String,
    sprites : Array
  },

  mounted() {

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
    },

    newValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },

  data() {
    return {
      searchQuery: '',
    };
  }

}
</script>
