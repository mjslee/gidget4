import GidgetObject from './gidget-object'


export default {

  // Object Data
  objects: [],
  recentID: -1,

  /*
   * Callbacks
   */
  objectCreated(obj) { console.log("An object was created!") },
  objectMoved(obj) { console.log("An object was moved!") },
  objectDeleted(obj) { console.log("An object was deleted!") },
  objectGrabbed(obj, childObj) { console.log("An object was grabbed!") },
  objectDropped(obj) { console.log("An object was dropped!") },

  /*
   * Create object in world
   */
  createObject(kwargs) {
    let obj = Object.assign({}, GidgetObject)
    obj = Object.assign(obj, kwargs)
    obj.engine = this
    obj.create()
    this.objects.push(obj)
    return obj
  },
};
