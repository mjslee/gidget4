<template>
  <div id="app">
    <GidgetGame
      :code="game.code"
      :size="game.size"
      :tiles="game.tiles"
      :objects="game.objects"
      :goals="game.goals"
      :imports="game.imports" />
  </div>
</template>


<script>
import GidgetGame from '@/components/Gidget/Game'


export default {
  name: 'app',
  components: {
    GidgetGame
  },

  data() {
    return {
      game: {
        code: `Gidget.left();
Gidget.up();
let goLeft = false;

for (let i = 0; i <= 3; i++) {
  for (let j = 0; j <= 2; j++) {
    goLeft ? Gidget.left() : Gidget.right();
  }
  
  if (i == 3) {
    // Example comment
    break;
    /* Switch sides or something */
  }
  
  Gidget.down();
  goLeft = !goLeft;
}

Gidget.right();
Gidget.right();`,
        size: 4,
        tiles: [
          { type: 'dirt', position: { x: 1, y: 2 }},
        ],
        objects: [
          { type: 'Gidget', mixins: ['Player'], position: { x: 1, y: 1 } },
          { type: 'Puppy', position: { x: 2, y: 3 } },
        ],
        goals: [
          {
            assert: 'equal',
            arguments: ['Gidget.position', 'Puppy.position']
          },
          {
            assert: 'equal',
            arguments: ['x', 5]
          },
          {
            assert: 'equal',
            arguments: ['y', 'cool']
          },
        ],
        imports: {

        }
      }
    }
  }
}
</script>
