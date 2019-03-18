export default {
  // Parents
  world: undefined,
  grabber: undefined,

  // Object Data
  id: -1,
  type: undefined,
  name: undefined,
  image: undefined,

  blocking: false,

  // World Data
  energy: 100,
  grabbed: [],
  position: { x: 0, y: 0 },
  layer: 0,


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

    // Individually set these as to not use references
    this.position.x = x;
    this.position.y = y;

    // Detect object collisions
    this.world.detectCollision(this);

    // Call without 'x' and 'y' arguments so only the callback is ran
    this.world.moveObject(this);

    return true;
  },


  /**
   * Get point path array between two points.
   * @param {number} x
   * @param {number} y
   */
  path(x, y) {
    // Virtual positions
    let nextX = this.position.x;
    let nextY = this.position.y;

    // Get differences of current position and desired position
    let diffX = x - nextX;
    let diffY = y - nextY;

    const result = [];

    // Get differences to zero to be at desired position
    while (diffX != 0 || diffY != 0) {
      if (diffX > 0) {
        diffX--;
        result.push([++nextX, nextY]);
      }
      else if (diffX < 0) {
        diffX++;
        result.push([--nextX, nextY]);
      }

      if (diffY > 0) {
        diffY--;
        result.push([nextX, ++nextY]);
      }
      else if (diffY < 0) {
        diffY++;
        result.push([nextX, --nextY]);
      }
    }

    return result;
  },


  /**
   * Walk object to a position.
   * @param {number} x
   * @param {number} y
   */
  walk(x, y, intervalMilliseconds=500) {
    const path = this.path(x, y);

    // Nowhere to move!
    if (path.length < 1)
      return false;

    // Move immediately to circumvent setInterval's initial delay
    if (!this.move(...path[0]))
      return false;

    // If we only needed to move once, then finish
    if (path.length === 1)
      return true;

    // Move one tile every given milliseconds
    let i = 1, interval = setInterval(() => {
      if (!this.move(...path[i]) || ++i >= path.length)
        clearInterval(interval);
    }, intervalMilliseconds);
  },


  /**
   * Grab object into this object's grabbed array.
   * @param {number/string} ID or name of object to grab.
   */
  grab(id_or_name) {
    // Get object
    const field = typeof id_or_name === 'number' ? 'id' : 'name';
    const obj = this.world.getObject(obj => 
      obj[field] === id_or_name &&
      obj.position.x === this.position.x &&
      obj.position.y === this.position.y);

    // Make sure object exists
    if (obj === undefined)
      return false;

    // Remove object from world
    obj.remove();

    // Add object to grabbed array
    this.grabbed.push(obj);

    // Set grabber
    obj.grabber = this;
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

    // Find index of object
    const field = typeof id_or_name === 'number' ? 'id' : 'name';
    const index = this.grabbed.findIndex(obj => obj[field] === id_or_name);

    // Make sure object exists
    if (index < 0)
      return false;

    // Save object before deleting it
    const obj = this.grabbed[index];
    obj.position.x = this.position.x;
    obj.position.y = this.position.y;

    // Remove grabber
    obj.grabber = undefined;

    // Remove from `grabbed` array
    this.grabbed.splice(index, 1);

    // Add object back to world
    this.world.addObject(obj);
    return true;
  },


  /**
   * Remove this object from the world.
   */
  remove() {
    return this.grabber === undefined ? this.world.removeObject(this) : false;
  }
};
