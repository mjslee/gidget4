<template>
  <b-field>
    <b-autocomplete
      v-model="internalValue"
      :data="filteredData"
      :disabled="disabled"
      @typing="filterData"
      @focus="resetData"
      @select="canChange = true"
      icon-right="chevron-down"
      keep-first
      open-on-focus
      expanded
    />
    <p class="control" v-if="!disabled">
      <b-button type="is-primary" @click="change" :disabled="!canChange">
        Change
      </b-button>
    </p>
  </b-field>
</template>


<style scoped>
/deep/ input {
  cursor: pointer;
}
</style>


<script>
import Objects from '@/assets/gidget/game/objects';


export default {
  props: {
    value: {
      type: String
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  watch: {
    /**
     * Update internal value.
     *
     * @param {string} value
     * @return {void}
     */
    value(value) {
      this.internalValue = value;
    }
  },

  computed: {
    /**
     * Array of available object keys.
     *
     * @return {array[string]}
     */
    types() {
      if (!this.disabled)
        return Object.keys(Objects);
    },
  },

  data() {
    return {
      internalValue: this.value,
      filteredData: this.types,
      canChange: false,
    };
  },

  methods: {
    /**
     * Case-insensitively filter data by value.
     *
     * @param {string} value
     * @return {void}
     */
    filterData(value) {
      if (!(value && value.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)))
        return this.resetData();

      this.filteredData = this.types.filter((type) =>
        type.toLowerCase().indexOf(value.toLowerCase()) >= 0);

      if (this.filteredData.length < 1)
        return this.resetData();

      this.canChange = this.filteredData.includes(value);
    },

    /**
     * Reset the filtered data.
     *
     * @param {string} value
     * @return {void}
     */
    resetData() {
      this.filteredData = this.types;
    },

    /**
     * Emit change on click of change button.
     *
     * @return {void}
     */
    change() {
      this.canChange = false;
      this.$emit('change', Objects[this.internalValue]);
    }
  }
}
</script>
