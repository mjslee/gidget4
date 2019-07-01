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
   * @param {number} id Unique identification number.
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
   * Shout message as an object (usually for an overhead message).
   */
  shout(message) {
    this.message = message;
  },


  /**
   * Say message as an object.
   */
  say(messages) {
    // Allow for single message object or array of message objects
    if (!Array.isArray(messages))
      messages = [ messages ];

    // Add 'object' key to messages if not already set
    messages.forEach(message => {
      if (typeof message.object === 'undefined')
        message.object = this;
    });

    // Say the message
    this.world.sayMessages(messages);
  },


  /**
   * Move object to position in world.
   * @param {number} x
   * @param {number} y
   */
  move(x, y) {
    // Validate new position
    if (!this.world.isPositionValid(x, y))
      return false;

    // Individually set these as to not change references
    this.position.x = x;
    this.position.y = y;

    // Detect object collisions
    this.world.detectCollision(this);

    // Call without 'x' and 'y' arguments so only the callback is ran
    this.world.moveObject(this);

    return true;
  },


  /**
   * Promise: Walk object to a position.
   * @param {number} x
   * @param {number} y
   * @param {number} seconds Amount of seconds the walk should last for.
   */
  walk(x, y, milliseconds=500) {
    return new Promise((resolve, reject) => {
      // Get path from current position to specified position
      const path = this.world.getPath(this.position.x, this.position.y, x, y);

      // Nowhere to move!
      if (path.length < 1)
        return reject(1);

      // Move immediately to circumvent setInterval's initial delay
      if (!this.move(...path[0]))
        return reject(2);

      // If we only needed to move once, then finish
      if (path.length === 1)
        return resolve(0);

      // Calculate duration of each step
      const stepMilliseconds = milliseconds / (path.length - 1);

      // Move one tile every given milliseconds
      let i = 1, interval = setInterval(() => {
        if (!this.move(...path[i])) {
          // Could not move!
          clearInterval(interval);
          return reject(2);
        }

        if (++i >= path.length) {
          // Reached destination
          clearInterval(interval);
          return resolve(0);
        }
      }, stepMilliseconds);
    });
  },


  /**
   * Grab object into this object's grabbed array.
   * @param {number/string} ID or name of object to grab.
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

    // Add object to grabbed array
    //this.grabbed.push(obj);

    return true;
  },


  /**
   * Drop object from this object's grabbed array.
   * Do not set 'id_or_name' to drop self when grabbed.
   * @param {number/string} ID or name of object to drop.
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

    // Remove from `grabbed` array
    //this.grabbed.remove(obj);

    return true;
  },


  /**
   * Remove this object from the world.
   */
  remove() {
    return this.grabber === undefined ? this.world.removeObject(this.id) : false;
  },
};
