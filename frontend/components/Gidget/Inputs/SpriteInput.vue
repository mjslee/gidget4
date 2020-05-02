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
    <!-- TODO: Lazy render sprites -->
    <section class="columns is-multiline is-mobile">
      <div
        class="column is-one-quarter"
        v-for="sprite in filteredSprites"
        :key="name"
      >
        <b-tooltip :label="sprite[0]">
          <button
            @click="newValue = sprite[0]"
            :class="newValue == sprite[0] ? 'button is-primary is-active' : 'button'"
          >
            <figure class="image is-64x64">
              <img :src="sprite[1]" :alt="sprite[0]" />
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
