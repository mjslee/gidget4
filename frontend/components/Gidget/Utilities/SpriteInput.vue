<template>
  <article>
    <!-- Search -->
    <b-field>
      <b-input
        v-model="query"
        placeholder="Search..."
        icon="magnify"
        :icon-right="query ? 'close-circle' : ''"
        icon-right-clickable
        @icon-right-click="query = ''"
      />
    </b-field>

    <!-- Sprites -->
    <!-- TODO: Lazy rendering (maybe with vue-virtual-scroller) -->
    <section class="columns is-multiline is-mobile">
      <div
        class="column is-one-quarter"
        v-for="[sprite, src] in filteredSprites"
        :key="sprite"
      >
        <b-tooltip :label="sprite">
          <button
            @click="$emit('input', sprite)"
            :class="value == sprite ? 'button is-primary is-active' : 'button'"
          >
            <figure class="image is-64x64">
              <img :src="src" :alt="sprite" />
            </figure>
          </button>
        </b-tooltip>
      </div>
    </section>

  </article>
</template>


<style scoped>
.button {
  height: auto;
}

.columns {
  padding-top: 2rem;
  max-height: 20rem;
  width: 100%;
  overflow-y: scroll
}

.column {
  text-align: center;
}
</style>


<script>
export default {
  props: {
    value: String,
    sprites: Object
  },

  computed: {
    /**
     * Filtered sprites when search is used.
     *
     * @return {array}
     */
    filteredSprites() {
      return this.query.length > 0
        ? this.spriteArray.filter((sprite) => sprite[0].includes(this.query))
        : this.spriteArray;
    },

    /**
     * Sprites object entries.
     *
     * @return {object[array[string]]}
     */
    spriteArray() {
      return Object.entries(this.sprites);
    }
  },

  data: () => ({ query: '' })
}
</script>
