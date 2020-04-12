<template>
  <div :class="tileClass" :style="tileStyle" @click="select"></div>
</template>


<style scoped>
.grass           { background-image: url("/gidget/sprites/grass.png");            }
.dirt            { background-image: url("/gidget/sprites/dirt.png");             }
.cobblestone     { background-image: url("/gidget/sprites/cobblestone.png");      }
.infected-dirt   { background-image: url("/gidget/sprites/infecteddirt.png");     }
.water           { background-image: url("/gidget/sprites/water.png");            }
.lava-crack      { background-image: url("/gidget/sprites/lava-crack.png");       }
.lava            { background-image: url("/gidget/sprites/lava.png");             }
.oil             { background-image: url("/gidget/sprites/oil.png");              }
.road-cross      { background-image: url("/gidget/sprites/road-cross.png");       }
.road-horizontal { background-image: url("/gidget/sprites/road-horizontal.png");  }
.road-vertical   { background-image: url("/gidget/sprites/road-vertical.png");    }
.sand            { background-image: url("/gidget/sprites/sand.png");             }
.sea             { background-image: url("/gidget/sprites/sea.png");              }
.tile-black      { background-image: url("/gidget/sprites/tile-black.png");       }
.tile-blue       { background-image: url("/gidget/sprites/tile-blue.png");        }
.tile-dark       { background-image: url("/gidget/sprites/tile-dark.png");        }
.tile-green      { background-image: url("/gidget/sprites/tile-green.png");       }
.tile-grey       { background-image: url("/gidget/sprites/tile-grey.png");        }
.tile-light      { background-image: url("/gidget/sprites/tile-light.png");       }
.tile-orange     { background-image: url("/gidget/sprites/tile-orange.png");      }
.tile-pink       { background-image: url("/gidget/sprites/tile-pink.png");        }
.tile-metallic   { background-image: url("/gidget/sprites/tile.png");             }
.tile-purple     { background-image: url("/gidget/sprites/tile-purple.png");      }
.tile-red        { background-image: url("/gidget/sprites/tile-red.png");         }
.tile-white      { background-image: url("/gidget/sprites/tile-white.png");       }
.tile-yellow     { background-image: url("/gidget/sprites/tile-yellow.png");      }
.yellow-brick    { background-image: url("/gidget/sprites/yellow-brick.png");     }

.tile {
  display: inline-block;
  background-size: contain;
  border-radius: 0.25rem;
  border: 1px solid black;
}

.selected {
  pointer-events: none;
  box-shadow: 0 0 3rem 1rem lime inset, 0 0 2rem lime;
}
</style>


<script>
export default {
  props: {
    sprite: {
      type: String,
      default: 'grass'
    },
    size: {
      type: Number,
      default: 5
    },
    margin: {
      type: Number,
      default: .1
    },
    position: Object
  },

  computed: {
    /**
     * String ID of tile.
     *
     * @return {string}
     */
    id() {
      return `${this.position.x},${this.position.y}`;
    },

    /**
     * Is tile selected?
     *
     * @return {boolean}
     */
    isSelected() {
      return this.$store.state.tiles.selected == this.id;
    },

    /**
     * Sprite name for tile.
     *
     * @return {string}
     */
    tileSprite() {
      const tile = this.$store.getters['tiles/getTile'](this.position);
      return typeof tile == 'object' ? tile.sprite || this.sprite : this.sprite;
    },


    /**
     * HTML class for tile element.
     *
     * @return {string}
     */
    tileClass() {
      return `${this.tileSprite} tile${this.isSelected ? ' selected' : ''}`;
    },

    /**
     * CSS Style for tile element.
     *
     * @return {string}
     */
    tileStyle() {
      return {
        margin: this.margin + 'rem',
        height: this.size + 'rem',
        width: this.size + 'rem'
      };
    }
  },

  methods: {
    /**
     * Select tile and de-select object.
     *
     * @return {void}
     */
    select() {
      this.$store.commit('tiles/setSelected', this.id);
      this.$store.commit('objects/setSelected', undefined);
    },
  }
}
</script>
