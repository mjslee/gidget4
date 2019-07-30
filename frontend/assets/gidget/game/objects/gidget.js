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
      animate(this, async (tween, $el, wasInterrupted, timeline) => {
        await tween(50, { x: 500 })
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
        await tween(50, { x: -50 })
      })
    }
  }
}
