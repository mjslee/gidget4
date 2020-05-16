<template>
  <article>
    <!-- Header -->
    <section class="section level">
      <highlight class="level-left" :value="code" />
      <div class="level-right">
        <span class="tag is-black">{{ type }}</span>
      </div>
    </section>

    <!-- Sections -->
    <b-collapse
      animation="slide"
      @open="openedSection = i"
      :open="openedSection == i"
      :key="'section-' + i"
      v-for="(section, i) of sections"
    >
      <div slot="trigger" slot-scope="props" class="card-header" role="button">
        <p class="card-header-title">{{ section.title }}</p>
        <a class="card-header-icon">
          <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
        </a>
      </div>
      <div class="card-content"><markdown :value="section.text" /></div>
    </b-collapse>
  </article>
</template>


<style scoped>
.level {
  padding: 1.25rem 2rem 0 1rem;
}
</style>


<script>
import Type from './Type';
import Markdown from './Markdown';
import Highlight from './Highlight';
import GidgetConstants from '@/assets/gidget/game/gidget-constants';


export default {
  name: 'Insight',

  components: {
    Highlight,
    Markdown
  },

  mixins: [
    Type
  ],

  computed: {
    /**
     * Sections to be displayed in collapse element.
     *
     * @return {array}
     */
    sections() {
      const sections = [];

      // Type Sections
      const typeSections = GidgetConstants[this.type];
      if (Array.isArray(typeSections))
        sections.push(...typeSections);

      // Object Sections
      if (this.documentation && Array.isArray(this.documentation.sections))
        sections.push(...this.documentation.sections);

      return sections;
    }
  },

  data() {
    return {
      openedSection: 0
    }
  }
}
</script>
