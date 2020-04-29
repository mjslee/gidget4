<template>
  <article>
    <!-- Search -->
    <b-field>
      <b-input
        v-model="query"
        placeholder="Search..."
        icon="magnify"
        :icon-right="query.length ? 'close-circle' : ''"
        icon-right-clickable
        @icon-right-click="query = ''"
      />
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

  computed: {
    /**
     * Filtered sprites when search is used.
     *
     * @return {array}
     */
    filteredSprites() {
      if (typeof this.query == 'string' && this.query.length > 0)
        return this.sprites.filter(s => s.title.includes(this.query));
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
      query: '',
    };
  }
}
</script>
