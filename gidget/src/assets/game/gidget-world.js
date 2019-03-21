import GidgetObject from './gidget-object'
import GidgetObjects from './objects/_import'



export default {

  // World Data
  size: 4,

  // Object Data
  player: undefined,
  objects: [],
  nextID: -1,

  // Callbacks
  onObjectAdded(obj) { console.log(obj, 'An object was added!') },
  onObjectMoved(obj) { console.log(obj, 'An object was moved!') },
  onObjectRemoved(obj) { console.log(obj, 'An object was removed!') },


  /**
   * Clone a new GidgetWorld instance
   * @param {dictionary} kwargs Default properties.
   */
  create(kwargs) {
    const obj = Object.assign({}, this);
    Object.assign(obj, kwargs);
    return obj;
  },


  /**
   * Determine if position is valid.
   * + Check that tile position exists.
   * + Check for blocking objects.
   * @param {function} conditions
   */
  isPositionValid(x, y) {
    return (x >= 0 && x <= this.size && y >= 0 && y <= this.size) &&
      !this.getObject((obj) => 
        obj.blocking && this.insideObjectBoundaries(obj, x, y)
      )
  },


  /**
   * Find object based on specified conditions.
   * @param {function} conditions
   */
  getObject(conditions) {
    return this.objects.find(conditions);
  },


  /**
   * Find object based on its position.
   * @param {number} x
   * @param {number} y
   */
  getObjectAt(x, y) {
    return this.getObject((obj) => 
      obj.position.x === x &&
      obj.position.y === y);
  },


  /**
   * Create object in world. 'type' attribute in kwargs is required.
   * For example: kwargs={type: 'Gidget'}
   * @param {object} kwargs Attributes to assign to object on creation.
   */
  createObject(kwargs) {
    // Copy object into another variable
    let obj = Object.assign({}, GidgetObject);
    obj.world = this;

    // Merge the types overrides (like attributes in Gidget.js)
    if (typeof kwargs === 'object' && kwargs['type'])
      Object.assign(obj, GidgetObjects[kwargs.type]);

    // Merge kwargs into the new object
    Object.assign(obj, kwargs);

    // Create the object and add it to the world
    obj.create(++this.nextID);
    this.addObject(obj);

    return obj;
  },


  /**
   * Create player object in world.
   * @param {object} kwargs Attributes to assign to object on creation.
   */
  createPlayer(kwargs) {
    this.player = this.createObject(kwargs);
    return this.player;
  },


  /**
   * Add object to world. Use 'createObject' to create a new object.
   * @params {object} obj Object to add.
   */
  addObject(obj) {
    this.objects.push(obj);

    // Call callback
    if (typeof this.onObjectAdded === 'function')
      this.onObjectAdded(this);

    return true;
  },


  /**
   * Remove object from world.
   * @params {object} obj Object to remove.
   */
  removeObject(obj) {
    let index = this.objects.findIndex((findObj) => findObj.id === obj.id);

    // Remove from world's objects
    this.objects.splice(index, 1);

    // Call callback
    if (typeof this.onObjectRemoved === 'function')
      this.onObjectRemoved(this);

    delete this;
    return true;
  },


  /*
   * Move object to another tile's position.
   * Using 'obj.move(x, y)' is the preferred way to move objects.
   * @params {object} obj Object that was moved.
   */
  moveObject(obj, x, y) {
    let result = true;
    if (x !== undefined || y !== undefined)
      result = obj.move(x, y);

    // Call callback
    if (typeof this.onObjectMoved === 'function')
      this.onObjectMoved(this);

    return result;
  },


  /**
   * Detect an object collision based on position. Run 'onCollision' for each
   * collided object.
   * @param {object} obj Object to detect collisions for.
   */
  detectCollision(obj) {
    this.objects.filter((obj2) =>
      obj.id !== obj2.id &&
      this.insideObjectBoundaries(obj, obj2.position.x, obj2.position.y)
    ).forEach((obj2) => {
      // Collision callback to first object
      if (typeof obj.onCollision === 'function')
        obj.onCollision.call(obj, obj2) !== false;

      // Collision callback to second object
      if (typeof obj2.onCollision === 'function')
        obj2.onCollision.call(obj2, obj) !== false;
    });
  },


  /**
   * Get an object's boundaries.
   * (There's probably a more efficient way to do this)
   * @param {object} obj Object to get boundaries for.
   */
  getObjectBoundaries(obj) {
    const fromX = Math.floor(obj.position.x - ((obj.scale / 2) - 1));
    return {
      fromX: fromX,
      fromY: obj.position.y - Math.floor(obj.scale - 1),
      toX: obj.position.x + (obj.position.x - fromX),
      toY: obj.position.y
    }
  },


  /**
   * Determine if x and y are inside an object's boundaries.
   */
  insideObjectBoundaries(obj, x, y) {
    // Do not scale boundaries up with object's 'scale' property
    if (!obj.scaleBoundaries)
      return obj.position.x === x && obj.position.y === y;

    // Scale boundaries up with object scale
    // Less efficient than above, so use this only with scaleBoundaries
    const bounds = this.getObjectBoundaries(obj);
    return (
      x >= bounds.fromX && x <= bounds.toX &&
      y >= bounds.fromY && y <= bounds.toY
    );
  },


  /**
   * Get point path array between two points.
   * @param {number} fromX
   * @param {number} fromY
   * @param {number} toX
   * @param {number} toY
   */
  getPath(fromX, fromY, toX, toY) {
    // Get differences of current position and desired position
    let diffX = toX - fromX;
    let diffY = toY - fromY;

    const result = [];

    // Get differences to zero to be at desired position
    while (diffX != 0 || diffY != 0) {
      if (diffX > 0) {
        diffX--;
        result.push([++fromX, fromY]);
      }
      else if (diffX < 0) {
        diffX++;
        result.push([--fromX, fromY]);
      }

      if (diffY > 0) {
        diffY--;
        result.push([fromX, ++fromY]);
      }
      else if (diffY < 0) {
        diffY++;
        result.push([fromX, --fromY]);
      }
    }

    return result;
  }

}
