<template>
  <b-taginput
    v-model="internalValue"
    :data="filteredData"
    @typing="filterData"
    @add="filterData()"
    icon-right="chevron-down"
    autocomplete
    keep-first
    open-on-focus
  />
</template>


<style scoped>
/deep/ .tag {
  cursor: grab;
}
</style>


<script>
export default {
  props: {
    value: Array[String],
    data: Array[String],
    selected: String,
  },

  watch: {
    /**
     * Set tag as primary when selected.
     *
     * @param {string} value
     * @return {void}
     */
    selected(value) {
      this.$el.querySelectorAll('.tag').forEach((tag) =>
        tag.classList.remove('is-primary'));

      if (!value)
        return;

      const tag = this.$el.querySelector(`[data-value='${value}']`);
      if (tag)
        tag.classList.add('is-primary');
    }
  },

  computed: {
    /**
     * Shallow clone of value prop.
     *
     * @param {array} value
     * @return {array}
     */
    internalValue: {
      get() {
        this.$nextTick(this.setTag);
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
        this.updatedValue = value;
      }
    },
  },

  data() {
    return {
      updatedValue: [],
      filteredData: this.data,
      draggingTag: undefined
    };
  },

  methods: {
    /**
     * Set classes, attributes, and drag-drop events for all tags.
     *
     * @return {void}
     */
    setTag() {
      this.$el.querySelectorAll('.tag').forEach(($el, i) => {
        const value = this.value[i];
        $el.setAttribute('draggable', true);
        $el.setAttribute('ondrop', true);
        $el.setAttribute('data-index', i);
        $el.setAttribute('data-value', value);
        $el.ondragstart = this.dragStart;
        $el.ondragover = this.dragOver;
        $el.ondragleave = this.dragLeave;
        $el.ondrop = this.dragEnd;
        $el.onclick = () => this.$emit('update:selected',
          this.selected !== value ? value : undefined);
      });
    },

    /**
     * Set the filteredData with a filter.
     *
     * @param {string} value
     * @return {void}
     */
    filterData(value) {
      this.filteredData = !value ? this.data : this.data.filter((mixin) =>
        mixin.toLowerCase().indexOf(value.toLowerCase()) >= 0);
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
      this.$el.querySelectorAll('.tag').forEach(($el) => {
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
      return target.parentNode.classList.contains('tag')
        ? target.parentNode : target;
    }
  }
};
</script>
