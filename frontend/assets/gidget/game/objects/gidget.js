import { animate } from '../gidget-utility'

export default {
  image: 'gidget.png',
  layer: 5,

  onCreate() {

  },

  onCollision() {

  },

  onMove() {
    if (this.energy > 0)
      this.energy -= 1

    else
      throw {
        text: 'I ran out of energy!'
      }
  },

  exposed: {
    shake() {
      this.say({ type: 'overhead', text: "I'm shaking!" });
      animate(this, async (tween, $el, wasInterrupted, timeline) => {
        await tween(50, { x: 50 })
        await tween(50, { x: -50 })
        await tween(50, { x: 50 })
        await tween(50, { x: -50 })
        await tween(50, { x: 50 })
        await tween(50, { x: -50 })
        await tween(50, { x: 50 })
        await tween(50, { x: -50 })
        await tween(50, { x: 50 })
        await tween(50, { x: -50 })
        await tween(50, { x: 50 })
        await tween(50, { x: -50 })
        await tween(50, { x: 50 })
        await tween(5000, { x: -50 })
      });

      if (false)
        throw {
          text: 'This is an error.'
        };

    }
  }
}
