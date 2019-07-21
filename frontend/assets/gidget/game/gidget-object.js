import { wait } from './gidget-utility'


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
  create(id) {
    // TODO: Redo this, clone an instance of GidgetObject instead
    this.id = id

    // Give object a name if not already set
    if (this.name === undefined && this.type !== undefined)
      this.name = this.type

    // Run onCreate callback
    if (typeof this.onCreate === 'function')
      this.onCreate()

    return this
  },


  /**
   * Removes this object from the world.
   *
   * @return {boolean}
   */
  remove() {
    // TODO: Make this less confusing
    return this.grabber === undefined ? this.world.removeObject(this.id) : false;
  },


  /**
   * Adds a callback to be called during a visual step.
   *
   * @param {function} func -- Callback function
   * @return {void}
   */
  addHook(callback, when='before') {
    this.world.hooks.push({ callback, when })
  },


  /**
   * Grabs a game object into this game object's grabbed array.
   *
   * @param {number/string} ID or name of object to grab.
   * @return {boolean}
   */
  grab(id_or_name) {
    // TODO: Change arguments to include passing in the object itself
    // Get object
    const field = typeof id_or_name === 'number' ? 'id' : 'name';
    const obj = this.world.getObject(obj =>
      obj.grabbable !== false &&
      typeof obj.grabber == 'undefined' &&
      obj[field] === id_or_name &&
      obj.position.x === this.position.x &&
      obj.position.y === this.position.y)

    // Make sure object exists
    if (typeof obj == 'undefined')
      return false

    // Set grabber
    obj.grabber = this.id

    return true
  },


  /**
   * Drops object from this object's grabbed array.
   * Do not set 'id_or_name' to drop self when grabbed.
   *
   * @param {number/string} ID or name of object to drop.
   * @return {boolean}
   */
  drop(id_or_name) {
    // TODO: Change arguments to include passing in the object itself
    // Drop self when self has been grabbed
    if (this.grabber !== undefined)
      return this.grabber.drop(this.id);

    // Find object
    const field = typeof id_or_name === 'number' ? 'id' : 'name';
    const obj = this.world.getObject(obj => obj[field] === id_or_name);

    if (obj === undefined)
      return false;

    // Save object before deleting it
    obj.position.x = this.position.x;
    obj.position.y = this.position.y;

    // Remove grabber
    obj.grabber = undefined;

    return true;
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

    return true
  },


  /**
   * Moves the game object to a position in the world.
   *
   * @param {object} position
   * @return {boolean}
   */
  move(position, collisions=true, move=true) {
    // Validate new position
    if (!this.world.isPositionValid(position))
      return false

    // TODO: Check if it is still necessary to do this individually
    // Individually set these as to not change references
    this.position.x = position.x
    this.position.y = position.y

    // Detect object collisions
    if (collisions)
      this.world.getCollisions(this)

    // Call without 'x' and 'y' arguments so only the callback is ran
    if (move)
      this.world.moveObject(this)

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

    // Step by step...
    path.forEach(position => {
      if (!this.move(position, true, false))
        return false

      // Store valid path for the UI to interpret
      validPath.push(position)
    })

    // No valid movements
    if (!validPath.length)
      return false

    // Call onWalk callback
    if (typeof this.onWalk == 'function')
      this.onWalk(validPath)

    return true
  },


  /**
   * Gets a stringified position.
   *
   * @return {string} - Stringified position.
   */
  exposed: {
    getPosition() {
      return JSON.stringify({
        x: this.object.position.x,
        y: this.object.position.y
      })
    }
  }
}
