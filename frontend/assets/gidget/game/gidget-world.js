import _ from 'lodash';
import GidgetObject from './gidget-object'
import GidgetObjects from './objects'
import GidgetMixins from './mixins'



export default {
  nextID: -1,
  size: 3,
  objects: [],
  messages: [],

  // Callbacks
  //onObjectAdded(obj) { console.log(obj, 'An object was added!') }
  //onObjectMoved(obj) { console.log(obj, 'An object was moved!') }
  //onObjectRemoved(obj) { console.log(obj, 'An object was removed!') }
  //onObjectSay(messages) { console.log(messages, 'An object said something!') }


  /**
   * Clone a new GidgetWorld instance
   * @param {dictionary} kwargs Default properties.
   */
  create(kwargs) {
    const world = _.cloneDeep(this);
    Object.assign(world, kwargs);
    return world;
  },


  /**
   * Determine if position is valid.
   * + Check that tile position exists.
   * + Check for blocking objects.
   * @param {function} conditions
   */
  isPositionValid(x, y) {
    return (x >= 0 && x <= this.size - 1 && y >= 0 && y <= this.size - 1) &&
      !this.getObject((obj) =>
        obj.blocking && this.insideObjectBoundaries(obj, x, y)
      )
  },


  getObjectsGrouped() {
    const result = {};

    this.objects.forEach(obj => {
      if (typeof result[obj.name] === 'undefined')
        result[obj.name] = obj;

      else if (Array.isArray(result[obj.name])) {
        result[obj.name].push(obj);
        obj.arrayIndex = result[obj.name].length - 1;
      }

      else {
        let prevObj = result[obj.name];
        result[obj.name] = [prevObj, obj];
        prevObj.arrayIndex = 0;
        obj.arrayIndex = 1;
      }
    })

    return result;
  },


  /**
   * Find object based on specified conditions.
   * @param {string/function} Name or conditions
   */
  getObject(name_or_conditions) {
    return typeof name_or_conditions === 'string' ?
      this.objects.find(obj => obj.name === name_or_conditions) :
      this.objects.find(name_or_conditions);
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
   * Merge two objects together while keeping the 'exposed' property intact.
   * @param {object} obj1 - Object to merge into.
   * @param {object} obj2 - Object to merge from.
   */
  mergeObjects(obj1, obj2) {
    if (typeof obj1 === 'undefined' || typeof obj2 === 'undefined')
      return false;

    // Store exposed prop
    const exposed = obj1.exposed || {};

    // Deep clone the object we will be merging so that we can modify it
    // at any point without it disrupting other objects that also have merged
    // the same object.
    obj2 = _.cloneDeep(obj2);

    // Merge obj2[exposed] into dict that will become obj1[exposed]
    if (typeof obj2.exposed === 'object')
      Object.assign(exposed, obj2.exposed);

    // Merge obj2 into obj1
    Object.assign(obj1, obj2);

    // Reassign exposed
    obj1.exposed = exposed;
    obj1.exposed.object = obj1;
    return true;
  },


  /**
   * Create object in world. 'type' attribute in kwargs is required.
   * For example: kwargs={type: 'Gidget'}
   * @param {object} kwargs Attributes to assign to object on creation.
   */
  createObject(kwargs) {
    const obj = _.cloneDeep(GidgetObject);  // Clone template object
    obj.world = this;

    if (typeof kwargs === 'object') {
      // Merge object type
      if (typeof kwargs.type === 'string')
        this.mergeObjects(obj, GidgetObjects[kwargs.type]);

      // Merge mixins objects
      if (Array.isArray(kwargs.mixins))
        kwargs.mixins.forEach(mixin => {
          this.mergeObjects(obj, GidgetMixins[mixin]);
        });
    }

    // Merge kwargs into object
    Object.assign(obj, kwargs);

    // Add 'object' property so methods can access the object
    if (typeof obj.methods === 'object')
      obj.methods.object = obj;

    // Create the object and add it to the world
    obj.create(++this.nextID);
    this.addObject(obj);

    return obj;
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
  removeObject(id) {
    // Find objects index by its ID
    let index = this.objects.findIndex((obj) => obj.id === id);
    if (index < 0)
      return false;

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
      let maybePromise = undefined;

      // Collision callback to first object
      if (typeof obj.onCollision === 'function')
        maybePromise = obj.onCollision.call(obj, obj2);

      // Check if obj.onCollision returned a promise, and if so then we'll
      // call the second objects onCollision callback after the promise
      // is resolved (from using 'then')
      if (maybePromise && typeof maybePromise.then === 'function')
        maybePromise.then(() => {
          if (typeof obj2.onCollision === 'function')
            obj2.onCollision.call(obj2, obj);
        });

      // Return was not a promise, so not waiting required
      else if (typeof obj2.onCollision === 'function')
        obj2.onCollision.call(obj2, obj);
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
  },


  /**
   * Run onObjectSay() callback to pass to a UI.
   * @param {number} object - Object to send to callback.
   * @param {number} messages - Object array of messages.
   */
  sayMessages(messages) {
    // Set world messages, empty and replace data to avoid destroying references
    while (this.messages.length)
      this.messages.pop();
    messages.forEach(message => this.messages.push(message))

    // Call onObjectSay callback
    if (typeof this.onObjectSay === 'function')
      this.onObjectSay(messages);
  }

}
