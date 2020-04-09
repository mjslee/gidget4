<script>
export default {
  computed: {
    /**
     * 0th argument.
     *
     * @param {string}
     * @return {array[string]}
     */
    arg0: {
      get() {
        return this.value[0];
      },
      set(value) {
        this.$emit('input', [value, this.arg1]);
      }
    },

    /**
     * 1st argument.
     *
     * @param {string}
     * @return {array[string]}
     */
    arg1: {
      get() {
        return this.value[1];
      },
      set(value) {
        this.$emit('input', [this.arg0, value]);
      }
    },
  }
}
</script>
