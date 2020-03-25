<template>
  <article class="media">
    <figure class="media-left">
      <p class="image is-128x128">
        <img :src="sprite">
      </p>
    </figure>
    <div class="media-content">

      <b-field grouped group-multiline>

        <!-- Name -->
        <b-field label="Name">
          <b-input :value="name"></b-input>
        </b-field>

        <!-- Energy -->
        <b-field label="Energy">
          <b-slider :value="energy"></b-slider>
        </b-field>

      </b-field>

      <nav class="level">
        <div class="level-right">
          <div class="level-item">
            <b-button>Remove Object</b-button>
          </div>
        </div>
      </nav>

    </div>
  </article>
</template>


<script>
import { SPRITE_PATH } from '@/constants/paths'


export default {
  props: {
    name: String,
    type: String,
    energy: Number,
    mixins: Array[String],
    position: Object,
    image: String
  },

  components: {

  },

  computed: {
    /**
     * Get sprite of object with sprite path prefix.
     */
    sprite() {
      return SPRITE_PATH + this.image;
    },
  },

  data() {
    return {
      selectedSprite: undefined,
      sprites: [
        { title: 'apple', src: '/gidget/sprites/apple.png' },
        { title: 'bamboo', src: '/gidget/sprites/bamboo.png' },
        { title: 'basket', src: '/gidget/sprites/basket.png' },
        { title: 'bat', src: '/gidget/sprites/bat.png' },
        { title: 'battery', src: '/gidget/sprites/battery.png' },
        { title: 'beachball', src: '/gidget/sprites/beachball.png' },
        { title: 'beaver-osu', src: '/gidget/sprites/beaver-osu.png' },
        { title: 'beaver', src: '/gidget/sprites/beaver.png' },
        { title: 'bee', src: '/gidget/sprites/bee.png' },
        { title: 'beetle', src: '/gidget/sprites/beetle.png' },
        { title: 'bin', src: '/gidget/sprites/bin.png' },
        { title: 'bird', src: '/gidget/sprites/bird.png' },
        { title: 'block', src: '/gidget/sprites/block.png' },
        { title: 'blueprint', src: '/gidget/sprites/blueprint.png' },
        { title: 'boat', src: '/gidget/sprites/boat.png' },
        { title: 'boulder', src: '/gidget/sprites/boulder.png' },
        { title: 'brick', src: '/gidget/sprites/brick.png' },
        { title: 'bucket', src: '/gidget/sprites/bucket.png' },
        { title: 'bunny', src: '/gidget/sprites/bunny.png' },
        { title: 'button', src: '/gidget/sprites/button.png' },
        { title: 'cage', src: '/gidget/sprites/cage.png' },
        { title: 'cake', src: '/gidget/sprites/cake.png' },
        { title: 'camera', src: '/gidget/sprites/camera.png' },
        { title: 'candy', src: '/gidget/sprites/candy.png' },
        { title: 'car-sideways', src: '/gidget/sprites/car-sideways.png' },
        { title: 'car', src: '/gidget/sprites/car.png' },
        { title: 'cat-cyborg', src: '/gidget/sprites/cat-cyborg.png' },
        { title: 'cat-infected-stressed', src: '/gidget/sprites/cat-infected-stressed.png' },
        { title: 'cat-infected', src: '/gidget/sprites/cat-infected.png' },
        { title: 'cat', src: '/gidget/sprites/cat.png' },
        { title: 'cell', src: '/gidget/sprites/cell.png' },
        { title: 'chasm', src: '/gidget/sprites/chasm.png' },
        { title: 'checkerboard', src: '/gidget/sprites/checkerboard.png' },
        { title: 'chute', src: '/gidget/sprites/chute.png' },
        { title: 'cobblestone', src: '/gidget/sprites/cobblestone.png' },
        { title: 'container', src: '/gidget/sprites/container.png' },
        { title: 'crab', src: '/gidget/sprites/crab.png' },
        { title: 'crack', src: '/gidget/sprites/crack.png' },
        { title: 'crate', sprite: '/gidget/sprites/crate.png' },
        { title: 'credit', src: '/gidget/sprites/credit.txt' },
        { title: 'cube', src: '/gidget/sprites/cube.png' },
        { title: 'cupcake', src: '/gidget/sprites/cupcake.png' },
        { title: 'diamond', src: '/gidget/sprites/diamond.png' },
        { title: 'dog-cyborg', src: '/gidget/sprites/dog-cyborg.png' },
        { title: 'dog-infected-stressed', src: '/gidget/sprites/dog-infected-stressed.png' },
        { title: 'dog-infected', src: '/gidget/sprites/dog-infected.png' },
        { title: 'dog', src: '/gidget/sprites/dog.png' },
        { title: 'doghouse', src: '/gidget/sprites/doghouse.png' },
        { title: 'door', src: '/gidget/sprites/door.png' },
        { title: 'door2', src: '/gidget/sprites/door2.png' },
        { title: 'dragon', src: '/gidget/sprites/dragon.png' },
        { title: 'droid', src: '/gidget/sprites/droid.png' },
        { title: 'elephant', src: '/gidget/sprites/elephant.png' },
        { title: 'fence', src: '/gidget/sprites/fence.png' },
        { title: 'fire', src: '/gidget/sprites/fire.png' },
        { title: 'fish', src: '/gidget/sprites/fish.png' },
        { title: 'fly', src: '/gidget/sprites/fly.png' },
        { title: 'fox', src: '/gidget/sprites/fox.png' },
        { title: 'fridge', src: '/gidget/sprites/fridge.png' },
        { title: 'frog', src: '/gidget/sprites/frog.png' },
        { title: 'fuzzball', src: '/gidget/sprites/fuzzball.png' },
        { title: 'generator', src: '/gidget/sprites/generator.png' },
        { title: 'ghost', src: '/gidget/sprites/ghost.png' },
        { title: 'gidget-baby', src: '/gidget/sprites/gidget-baby.png' },
        { title: 'gidget-classic', src: '/gidget/sprites/gidget-classic.png' },
        { title: 'gidget-cry', src: '/gidget/sprites/gidget-cry.png' },
        { title: 'gidget-happy', src: '/gidget/sprites/gidget-happy.png' },
        { title: 'gidget-sad', src: '/gidget/sprites/gidget-sad.png' },
        { title: 'gidget-silly', src: '/gidget/sprites/gidget-silly.png' },
        { title: 'gidget-thinking', src: '/gidget/sprites/gidget-thinking.png' },
        { title: 'gidget-worried', src: '/gidget/sprites/gidget-worried.png' },
        { title: 'gidget', src: '/gidget/sprites/gidget.png' },
        { title: 'goat', src: '/gidget/sprites/goat.png' },
        { title: 'gold', src: '/gidget/sprites/gold.png' },
        { title: 'goop-formula', src: '/gidget/sprites/goop-formula.png' },
        { title: 'goop-monster', src: '/gidget/sprites/goop-monster.png' },
        { title: 'goop-red', src: '/gidget/sprites/goop-red.png' },
        { title: 'goop-space', src: '/gidget/sprites/goop-space.png' },
        { title: 'goop', src: '/gidget/sprites/goop.png' },
        { title: 'goop2', src: '/gidget/sprites/goop2.png' },
        { title: 'goop3', src: '/gidget/sprites/goop3.png' },
        { title: 'hidden', src: '/gidget/sprites/hidden.png' },
        { title: 'hole', src: '/gidget/sprites/hole.png' },
        { title: 'husky-uw', src: '/gidget/sprites/husky-uw.png' },
        { title: 'husky', src: '/gidget/sprites/husky.png' },
        { title: 'icecream', src: '/gidget/sprites/icecream.png' },
        { title: 'index', src: '/gidget/sprites/index.html' },
        { title: 'jar', src: '/gidget/sprites/jar.png' },
        { title: 'jellyfish', src: '/gidget/sprites/jellyfish.png' },
        { title: 'key', src: '/gidget/sprites/key.png' },
        { title: 'kitten-infected-stressed', src: '/gidget/sprites/kitten-infected-stressed.png' },
        { title: 'kitten-infected', src: '/gidget/sprites/kitten-infected.png' },
        { title: 'kitten', src: '/gidget/sprites/kitten.png' },
        { title: 'ladybug', src: '/gidget/sprites/ladybug.png' },
        { title: 'lava-crack', src: '/gidget/sprites/lava-crack.png' },
        { title: 'lava', src: '/gidget/sprites/lava.png' },
        { title: 'lifesaver', src: '/gidget/sprites/lifesaver.png' },
        { title: 'lion', src: '/gidget/sprites/lion.png' },
        { title: 'map', src: '/gidget/sprites/map.png' },
        { title: 'masterswitch', src: '/gidget/sprites/masterswitch.png' },
        { title: 'material', src: '/gidget/sprites/material.png' },
        { title: 'medialisting', src: '/gidget/sprites/medialisting.php' },
        { title: 'medkit', src: '/gidget/sprites/medkit.png' },
        { title: 'metal', src: '/gidget/sprites/metal.png' },
        { title: 'meteor', src: '/gidget/sprites/meteor.png' },
        { title: 'monkey', src: '/gidget/sprites/monkey.png' },
        { title: 'mouse', src: '/gidget/sprites/mouse.png' },
        { title: 'note', src: '/gidget/sprites/note.png' },
        { title: 'oil', src: '/gidget/sprites/oil.png' },
        { title: 'orange', src: '/gidget/sprites/orange.png' },
        { title: 'otter', src: '/gidget/sprites/otter.png' },
        { title: 'owl', src: '/gidget/sprites/owl.png' },
        { title: 'pail', src: '/gidget/sprites/pail.png' },
        { title: 'palmtree', src: '/gidget/sprites/palmtree.png' },
        { title: 'panda', src: '/gidget/sprites/panda.png' },
        { title: 'pebble', src: '/gidget/sprites/pebble.png' },
        { title: 'penguin', src: '/gidget/sprites/penguin.png' },
        { title: 'phonebooth', src: '/gidget/sprites/phonebooth.png' },
        { title: 'piglet-infected-stressed', src: '/gidget/sprites/piglet-infected-stressed.png' },
        { title: 'piglet-infected', src: '/gidget/sprites/piglet-infected.png' },
        { title: 'piglet', src: '/gidget/sprites/piglet.png' },
        { title: 'pipe', src: '/gidget/sprites/pipe.png' },
        { title: 'pizza', src: '/gidget/sprites/pizza.png' },
        { title: 'planet', src: '/gidget/sprites/planet.png' },
        { title: 'plank', src: '/gidget/sprites/plank.png' },
        { title: 'plug', src: '/gidget/sprites/plug.png' },
        { title: 'pod', src: '/gidget/sprites/pod.png' },
        { title: 'pod2', src: '/gidget/sprites/pod2.png' },
        { title: 'polkadot', src: '/gidget/sprites/polkadot.png' },
        { title: 'puddle', src: '/gidget/sprites/puddle.png' },
        { title: 'pufferfish', src: '/gidget/sprites/pufferfish.png' },
        { title: 'puppy', src: '/gidget/sprites/puppy.png' },
        { title: 'rabbit', src: '/gidget/sprites/rabbit.png' },
        { title: 'rainbow', src: '/gidget/sprites/rainbow.png' },
        { title: 'rat', src: '/gidget/sprites/rat.png' },
        { title: 'road-cross', src: '/gidget/sprites/road-cross.png' },
        { title: 'road-horizontal', src: '/gidget/sprites/road-horizontal.png' },
        { title: 'road-vertical', src: '/gidget/sprites/road-vertical.png' },
        { title: 'robot-big', src: '/gidget/sprites/robot-big.png' },
        { title: 'robot', src: '/gidget/sprites/robot.png' },
        { title: 'rock', src: '/gidget/sprites/rock.png' },
        { title: 'rocket', src: '/gidget/sprites/rocket.png' },
        { title: 'rope', src: '/gidget/sprites/rope.png' },
        { title: 'sand', src: '/gidget/sprites/sand.png' },
        { title: 'sapling', src: '/gidget/sprites/sapling.png' },
        { title: 'scraps', src: '/gidget/sprites/scraps.png' },
        { title: 'sea', src: '/gidget/sprites/sea.png' },
        { title: 'seashell', src: '/gidget/sprites/seashell.png' },
        { title: 'shark-fin', src: '/gidget/sprites/shark-fin.png' },
        { title: 'ship', src: '/gidget/sprites/ship.png' },
        { title: 'shrub', src: '/gidget/sprites/shrub.png' },
        { title: 'snow', src: '/gidget/sprites/snow.png' },
        { title: 'soap', src: '/gidget/sprites/soap.png' },
        { title: 'space', src: '/gidget/sprites/space.png' },
        { title: 'spider', src: '/gidget/sprites/spider.png' },
        { title: 'static', src: '/gidget/sprites/static.png' },
        { title: 'stone', src: '/gidget/sprites/stone.png' },
        { title: 'sushi-infected', src: '/gidget/sprites/sushi-infected.png' },
        { title: 'sushi', src: '/gidget/sprites/sushi.png' },
        { title: 'teleporter-a', src: '/gidget/sprites/teleporter-a.png' },
        { title: 'teleporter-b', src: '/gidget/sprites/teleporter-b.png' },
        { title: 'tiger', src: '/gidget/sprites/tiger.png' },
        { title: 'treasure', src: '/gidget/sprites/treasure.png' },
        { title: 'tree', src: '/gidget/sprites/tree.png' },
        { title: 'turtle', src: '/gidget/sprites/turtle.png' },
        { title: 'umbrella', src: '/gidget/sprites/umbrella.png' },
        { title: 'unicorn', src: '/gidget/sprites/unicorn.png' },
        { title: 'unknown-sad', src: '/gidget/sprites/unknown-sad.png' },
        { title: 'unknown', src: '/gidget/sprites/unknown.png' },
        { title: 'vault-door', src: '/gidget/sprites/vault-door.png' },
        { title: 'water', src: '/gidget/sprites/water.png' },
        { title: 'whale', src: '/gidget/sprites/whale.png' },
        { title: 'wood', src: '/gidget/sprites/wood.png' },
        { title: 'world', src: '/gidget/sprites/world.png' },
      ]
    };
  },

  methods: {

  }
}
</script>
