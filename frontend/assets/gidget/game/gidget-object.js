import _ from 'lodash'
import GidgetObjects from './objects'
import GidgetMixins from './mixins'
import { walkAnimation, poscmp } from './gidget-utility'



export default {
  // Parents
  world: undefined,
  grabber: undefined,

  // Object Data
  id: -1,
  type: undefined,
  name: undefined,
  image: undefined,
  message: undefined,

  // World Data
  energy: 100,
  position: { x: 0, y: 0 },
  layer: 0,
  scale: 1,
  path: [],

  // Boundaries
  blocking: false,
  scaleBoundaries: false,


  /**
   * Creates object.
   *
   * @param {number} id Unique identification number.
   * @return {object}
   */
  create(attrs) {
    // Get base type of game object
    const type = typeof attrs == 'object' ? attrs.type : undefined
    if (typeof type == 'undefined') {
      console.debug('type: Missing property.')
      return
    }

    // Create a deep clone of 'this' (GidgetObject), so we don't mutate
    // any of the base module's properties
    const self = _.cloneDeep(this)

    // Get base type of game object
    let base = GidgetObjects[attrs.type]
    if (!base) {
      console.debug(attrs.type + ': Base object not found.')
      return
    }

    // Merge in base and extra attributes
    _.merge(self, _.cloneDeep(base))
    _.merge(self, _.cloneDeep(attrs))

    // Merge in mixins
    if (typeof attrs.mixins == 'object') {
      attrs.mixins.forEach(mixin => {
        if (typeof GidgetMixins[mixin] == 'undefined')
          console.debug(mixin + ': Mixin does not exist.')
        else
          _.merge(self, _.cloneDeep(GidgetMixins[mixin]))
      })
    }

    // Update exposed 'get' properties
    self.updateProps()

    // If no name was provided in attrs we'll use its type as its name
    if (typeof self.name == 'undefined')
      self.name = self.type

    // Call onCreate callback
    if (typeof self.onCreate == 'function')
      self.onCreate()

    return self
  },


  /**
   * Updates target properties of getter properties.
   *
   * @return {void}
   */
  updateProps() {
    for (let prop in this.exposed) {
      if (!this.exposed.hasOwnProperty(prop))
        continue

      // Ensure property is a function
      if (typeof this.exposed[prop] != 'function')
        continue

      // Functions that start with 'get ', note the extra space
      if (prop.startsWith('get '))
        this.exposed[prop.slice(4)] = this.exposed[prop].call(this)

      // For a method to have the proper scope (this), we'll need to enclose
      // the function to set the proper scope. We'll assign an 'isEnclosed'
      // property to the function so we know not to enclose an enclosure.
      else if (!this.exposed[prop].isEnclosed) {
        const func = this.exposed[prop]
        this.exposed[prop] = (...args) => func.call(this, ...args)
        this.exposed[prop].isEnclosed = true
      }
    }
  },


  /**
   * Grabs a game object into this game object's grabbed array.
   *
   * @param {object|number|string} - A game object, id, or name.
   * @return {boolean} True if grab success.
   *
   * @example
   *   grab(Gidget)    // Gidget object
   *   grab('Gidget')  // Object name
   *   grab(1)         // Object ID
   */
  grab(gameObjectId) {
    // Ensure world object is set
    if (typeof this.world == 'undefined')
      return false

    const gameObject = this.world.getObject(gameObjectId, (gameObject) => {
      // Game object must be able to be grabbed
      if (gameObject.grabbable === false)
        return

      // Game object must not have a grabber
      if (typeof gameObject.grabber != 'undefined')
        return

      // Game object must have the same position as grabber game object
      if (!poscmp(gameObject.position, this.position))
        return

      return true
    })

    // Ensure filtered object exists
    if (typeof gameObject == 'undefined')
      return false

    // Set grabber
    gameObject.grabber = this.id

    // Call onGrab for our object
    if (typeof this.onGrab == 'function')
      this.onGrab(gameObject)

    // Call onGrabbed for the found object
    if (typeof gameObject.onGrabbed == 'function') {
      gameObject.onGrabbed.call(gameObject, this)
    }

    return true
  },


  /**
   * Drops object from this object's grabbed array.
   *
   * @param {number/string} ID or name of object to drop.
   * @return {boolean}
   *
   * @example
   *   drop(Gidget)    // Gidget object
   *   drop('Gidget')  // Object name
   *   drop(1)         // Object ID
   */
  drop(gameObjectId) {
    // Ensure world object is set
    if (typeof this.world == 'undefined')
      return false

    // Find grabbed object to drop
    const gameObject = this.world.getObject(gameObjectId, (gameObject) => {
      return gameObject.grabber == this.id
    })

    // Return false when game object does not exist
    if (typeof gameObject == 'undefined')
      return false

    // Save object before deleting it
    gameObject.position.x = this.position.x
    gameObject.position.y = this.position.y

    // Remove grabber
    gameObject.grabber = undefined

    // Call onDrop for our object
    if (typeof this.onDrop == 'function')
      this.onDrop(gameObject)

    // Call onDropped for the found object
    if (typeof gameObject.onDropped == 'function')
      gameObject.onDropped(this).call(gameObject)

    return true
  },


  /**
   * Says a message.
   *
   * @param {object} message - A message to say.
   * @return {boolean}
   */
  say(message) {
    // TODO: Add a shorthand for message to only be a string
    // Ignore messages without text
    if (typeof message.text != 'string')
      return false

    // Dialogue message?
    if (message.type === 'dialogue')
      this.world.say(message)

    // Overhead message?
    else
      this.message = message.text

    // Call onSay
    if (typeof this.onSay == 'function')
      this.onSay(message)

    return true
  },


  /**
   * Moves the game object to a position in the world.
   *
   * @param {object} position
   * @return {boolean}
   */
  move(position, collisions=true) {
    // Ensure world object is set
    if (typeof this.world == 'undefined')
      return false

    // Validate new position
    if (!this.world.validatePosition(position))
      return false

    // Individually set these as to not change references
    this.position.x = position.x
    this.position.y = position.y

    // Detect object collisions
    if (collisions)
      this.world.getCollisions(this)

    // Call onMove
    if (typeof this.onMove == 'function')
      this.onMove(position)

    return true
  },


  /**
   * Walks to position.
   *
   * @param {object} position
   * @return {boolean}
   */
  walk(position) {
    // Get path from current position to specified position
    const path = this.world.getPath(this.position, position)
    const validPath = []

    // Path length is 0? We're already here!
    if (!path.length)
      return true

    // Save invalid position so an animator can do a bump effect
    let invalidPosition

    // Step by step...
    for (let i = 0, len = path.length; i < len; i++) {
      // Attempt to move
      if (!this.move(path[i])) {
        invalidPosition = path[i]
        break
      }

      // Store valid path for the UI to interpret
      validPath.push(path[i])
    }

    // Call onWalk callback
    if (typeof this.onWalk == 'function')
      this.onWalk(validPath, invalidPosition)

    return validPath.length >= path.length
  },


  /**
   * Walk callback: Default walking animation.
   * This can be overridden with in a gidget object or mixin.
   *
   * @param {array[object]} path - Array of position objects.
   * @return {void}
   */
  onWalk(path) {
    walkAnimation(this, path)
  },


  /**
   * Gets a stringified position.
   *
   * @return {string} - Stringified position.
   */
  exposed: {
    'get id'() {
      return this.id
    },

    'get position'() {
      return JSON.stringify(this.position)
    },
  }
}
