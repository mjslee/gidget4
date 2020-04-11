<template>
  <section v-if="object">
    <b-field grouped>
      <b-field label="Move Object">
        <div class="buttons">
          <b-button @click="x -= 1" :disabled="leftDisabled"  icon-right="chevron-left" />
          <b-button @click="y += 1" :disabled="downDisabled"  icon-right="chevron-down" />
          <b-button @click="y -= 1" :disabled="upDisabled"    icon-right="chevron-up" />
          <b-button @click="x += 1" :disabled="rightDisabled" icon-right="chevron-right" />
        </div>
      </b-field>
      <b-field label="X">
        <b-numberinput v-bind="numberAttrs" :max="worldSize.width - 1" v-model="x" />
      </b-field>
      <b-field label="Y">
        <b-numberinput v-bind="numberAttrs" :max="worldSize.height - 1" v-model="y" />
      </b-field>
    </b-field>
  </section>
</template>


<script>
export default {
  props: {
    object: Object
  },

  computed: {
    /**
     * Height and width of world.
     *
     * @return {object[x,y]}
     */
    worldSize() {
      return this.$store.getters['game/getWorldSize'];
    },

    /**
     * X-axis getter and setter.
     *
     * @param {number} value
     * @return {number}
     */
    x: {
      get() {
        return this.object.position ? this.object.position.x : 0;
      },
      set(value) {
        if (value >= 0 && value < this.worldSize.width)
          this.update('x', value);
      }
    },

    /**
     * Y-axis getter and setter.
     *
     * @param {number} value
     * @return {number}
     */
    y: {
      get() {
        return this.object.position ? this.object.position.y : 0;
      },
      set(value) {
        if (value >= 0 && value < this.worldSize.height)
          this.update('y', value);
      }
    },

    /**
     * Can object be moved to the left?
     *
     * @return {boolean}
     */
    leftDisabled() {
      return this.x <= 0;
    },

    /**
     * Can object be moved downwards?
     *
     * @return {boolean}
     */
    downDisabled() {
      return this.y >= this.worldSize.height - 1;
    },

    /**
     * Can object be moved upwards?
     *
     * @return {boolean}
     */
    upDisabled() {
      return this.y <= 0;
    },

    /**
     * Can object be moved to the right?
     *
     * @return {boolean}
     */
    rightDisabled() {
      return this.x >= this.worldSize.width - 1;
    },
  },

  data() {
    return {
      numberAttrs: {
        labelPosition: 'on-border',
        controlsPosition: 'compact',
        min: 0
      }
    }
  },

  methods: {
    /**
     * Update object position axis to specified value.
     *
     * @param {string} axis - 'x' or 'y'
     * @param {number} value - Value to set axis position to.
     * @param {boolean}
     */
    update(axis, value) {
      if (this.object.id < 0)
        return false;

      this.$store.dispatch('objects/updateObject', {
        id    : this.object.id,
        key   : ['position', axis],
        value : value
      });
      return true;
    },
  }
};
</script>
