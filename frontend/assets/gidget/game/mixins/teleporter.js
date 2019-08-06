import { animate } from '../gidget-utility'


export default {

  exposed: {
    /**
     * Allow teleport activate to run.
     */
    setup() {
      this.isSetup = true
    },

    /**
     * Teleports objects in same position to a receiver.
     */
    activate() {
      if (this.setupRequired && !this.isSetup) {
        console.debug(this.name + ': Teleport is not set up.')
        throw {
          leftImage: this.image,
          text: 'Teleporter is not set up.'
        }
      }

      // Ensure receiver's object name is set
      if (typeof this.receiver == 'undefined') {
        console.debug(this.name + ': Property "receiver" is undefined.')
        return false
      }

      // Ensure receiver object exist
      const receiver = this.world.getObject(this.receiver)
      if (typeof receiver == 'undefined') {
        console.debug(this.name + ': Receiver not found.')
        return false
      }

      // Find one object in same position as teleporter
      const gameObject = this.world.getObject((gameObject) =>
        gameObject.name !== this.name &&
        this.position.x === gameObject.position.x &&
        this.position.y === gameObject.position.y)

      // Ensure object to teleport exists
      if (typeof gameObject == 'undefined') {
        console.debug(this.name + ': Game object not found.')
        return false
      }

      // Flicker animation for game object
      animate(gameObject, async (tween) => {
        await tween(100, { opacity: 0 })
        await tween(100, { opacity: 0.5 })
        await tween(100, { opacity: 0 })
        await tween(100, { opacity: 1 })
      })

      // Move game object to receiver
      return gameObject.move(receiver.position)
    },
  }
}
