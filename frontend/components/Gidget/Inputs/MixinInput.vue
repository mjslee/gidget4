<template>
  <b-taginput
    ref="input"
    v-model="internalValue"
    :data="filteredValues"
    @typing="filterValues"
    autocomplete
  />
</template>

<style lang="scss">
.tag-draggable {
  cursor: grab;
}
</style>


<script>
import Vue from 'vue';
import Mixins from '@/assets/gidget/game/mixins';


export default {
  props: {
    value: Array[String]
  },

  computed: {
    /**
     * Shallow clone of values prop.
     *
     * @param {array} value
     * @return {array}
     */
    internalValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$nextTick(this.setTag);
        this.$emit('input', value);
        this.updatedValue = value;
      }
    },

    /**
     * Array of values from the tag input.
     *
     * @param {array} value
     * @return {array}
     */
    newValue: {
      get() {
        return this.$refs.input.tags;
      },
      set(value) {
        this.internalValue = value;
      }
    },

    /**
     * Array of available values.
     *
     * @return {array}
     */
    availableValues() {
      return Object.keys(Mixins);
    },
  },

  data() {
    return {
      updatedValue: [],
      filteredValues: [],
      draggingTag: undefined
    };
  },

  mounted() {
    this.setTag();
  },

  methods: {
    /**
     * Set classes, attributes, and drag-drop events for all tags.
     *
     * @return {void}
     */
    setTag() {
      this.$el.querySelectorAll('.tag').forEach(($el, i) => {
        $el.className = 'tag tag-draggable';
        $el.setAttribute('draggable', true);
        $el.setAttribute('ondrop', true);
        $el.setAttribute('data-index', i);
        $el.ondragstart = this.dragStart;
        $el.ondragover = this.dragOver;
        $el.ondragleave = this.dragLeave;
        $el.ondrop = this.dragEnd;
      });
    },

    /**
     * Set the filteredValues with a filter.
     *
     * @param {string} value
     * @return {void}
     */
    filterValues(value) {
      this.filteredValues = this.availableValues.filter((mixin) =>
        mixin.toLowerCase().indexOf(value.toLowerCase()) >= 0
      );
    },

    /**
     * Called when tag dragging has begun.
     *
     * @param {object} target - Element being dragged.
     * @return {void}
     */
    dragStart(event) {
      if (!(event.target && event.target.classList.contains('tag')))
        return;

      event.target.classList.add('is-primary');
      this.draggingTag = event.target.getAttribute('data-index');
    },

    /**
     * Called when tag has been dropped.
     *
     * @param {object} event
     * @param {object} row
     * @return {void}
     */
    dragEnd(event) {
      event.preventDefault();
      const droppedTag = this.findTag(event.target).getAttribute('data-index');

      // Remove primary from all tag elements
      this.$el.querySelectorAll('.tag-draggable').forEach(($el) => {
        $el.classList.remove('is-primary');
      });

      // Swap draggingTag and droppedTag indexes
      if (this.draggingTag != droppedTag) {
        this.updatedValue.splice(droppedTag, 0,
          this.updatedValue.splice(this.draggingTag, 1)[0]);
        this.internalValue = this.updatedValue;
      }

      this.draggingTag = undefined;
    },

    /**
     * Called when row is dragged over another row.
     *
     * @param {object} event
     * @return {void}
     */
    dragOver(event) {
      event.preventDefault();
      if (event.target)
        this.findTag(event.target).classList.add('is-primary');
    },

    /**
     * Called when row is finished dragging over another row.
     *
     * @param {object} event
     * @return {void}
     */
    dragLeave(event) {
      event.preventDefault();
      if (event.target)
        this.findTag(event.target).classList.remove('is-primary');
    },

    /**
     * Get the parent tag element from a child element.
     *
     * @param {object} target
     * @return {HTMLSpanElement}
     */
    findTag(target) {
      return target.parentNode.classList.contains('tag-draggable')
        ? target.parentNode : target;
    }
  }
};
</script>
