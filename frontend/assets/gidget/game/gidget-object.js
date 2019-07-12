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
  transition: undefined,

  // World Data
  energy: 100,
  position: { x: 0, y: 0 },
  layer: 0,
  scale: 1,

  // Boundaries
  blocking: false,
  scaleBoundaries: false,


  /**
   * Create object in world.
   *
   * @param {number} id Unique identification number.
   * @return {object}
   */
  create(id) {
    this.id = id;

    // Give object a name if not already set
    if (this.name === undefined && this.type !== undefined)
      this.name = this.type;

    // Run onCreate callback
    if (typeof this.onCreate === 'function')
      this.onCreate();

    return this;
  },


  /**
   * Temporarily modify property.
   *
   * @param {string} property -- Property key to modify
   * @param {any} tempValue -- Value to set property to
   * @param {number} ms -- Temporary duration in milliseconds
   * @return {void}
   */
  async tempModify(property, tempValue, ms) {
    // Save value
    const value = this[property]

    // Set custom transition
    this[property] = tempValue

    await new Promise(resolve => setTimeout(resolve, ms));

    // Wait for transition to end, reset to empty string
    this[property] = value
  },


  /**
   * Say overhead message.
   *
   * @param {object} message
   * @return {boolean}
   */
  async say(message) {
    // Ignore messages without text
    if (typeof message.text !== 'string')
      return false;

    // Dialogue message?
    if (message.type === 'dialogue')
      this.world.say(message);

    // Overhead message?
    else
      // Temporarily modify message property
      this.tempModify('message', message.text, 3000)

    return true;
  },


  /**
   * Move object to position in world.
   *
   * @param {object} position
   * @return {boolean}
   */
  move(position) {
    // Validate new position
    if (!this.world.isPositionValid(position))
      return false;

    // Individually set these as to not change references
    this.position.x = position.x;
    this.position.y = position.y;

    // Detect object collisions
    this.world.detectCollision(this);

    // Call without 'x' and 'y' arguments so only the callback is ran
    this.world.moveObject(this);

    return true;
  },


  /**
   * Promise: Walk object to a position.
   *
   * @param {object} position
   * @param {number} seconds Amount of seconds the walk should last for.
   * @return {boolean}
   */
  walk(position, ms=100) {
    return new Promise((resolve, reject) => {
      // Get path from current position to specified position
      const path = this.world.getPath(this.position, position);

      // Nowhere to move!
      if (path.length < 1)
    	return reject(1);

      // Move immediately to circumvent setInterval's initial delay
      if (!this.move(path[0]))
    	return reject(2);

      // If we only needed to move once, then finish
      if (path.length === 1)
    	return resolve(0);

      // Calculate duration of each step
      const stepMs = ms / (path.length - 1);

      // Move one tile every given milliseconds
      let i = 1, interval = setInterval(() => {
    	if (!this.move(path[i])) {
    	  // Could not move!
    	  clearInterval(interval);
    	  return reject(2);
    	}

    	if (++i >= path.length) {
    	  // Reached destination
    	  clearInterval(interval);
    	  return resolve(0);
    	}
      }, stepMs);
    });
  },


  /**
   * Grab object into this object's grabbed array.
   *
   * @param {number/string} ID or name of object to grab.
   * @return {boolean}
   */
  grab(id_or_name) {
    // Get object
    const field = typeof id_or_name === 'number' ? 'id' : 'name';
    const obj = this.world.getObject(obj =>
      obj.grabbable !== false &&
      obj.grabber === undefined &&
      obj[field] === id_or_name &&
      obj.position.x === this.position.x &&
      obj.position.y === this.position.y);

    // Make sure object exists
    if (obj === undefined)
      return false;

    // Set grabber
    obj.grabber = this.id;

    return true;
  },


  /**
   * Drop object from this object's grabbed array.
   * Do not set 'id_or_name' to drop self when grabbed.
   *
   * @param {number/string} ID or name of object to drop.
   * @return {boolean}
   */
  drop(id_or_name) {
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
   * Remove this object from the world.
   *
   * @return {boolean}
   */
  remove() {
    return this.grabber === undefined ? this.world.removeObject(this.id) : false;
  },
}
