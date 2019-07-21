import { TweenLite, TimelineLite } from 'gsap'


/**
 * (await) Waits for milliseconds.
 *
 * @param {ms} Milliseconds to wait for.
 * @return {void}
 */
export async function wait(ms) {
  await new Promise(resolve => setTimeout(resolve, ms))
}


/**
 * Gets DOM element ID associated with a game object.
 *
 * @param {object} gameObject - A game object.
 * @return {element} DOM element of game object.
 */
export function getObjectElementId(gameObject) {
  return 'object-'+gameObject.name+'-'+gameObject.type+'-'+gameObject.id
}


/**
 * Gets DOM element of a game object.
 *
 * @param {object} gameObject - A game object.
 * @return {element} DOM element of game object.
 */
export function getObjectElement(gameObject) {
  return document.getElementById(getObjectElementId(gameObject))
}


/**
 * Gets DOM element of a tile.
 *
 * @param {object} position - Object containing 'x' and 'y' properties.
 * @return {element} DOM element of tile.
 */
export function getTileElement(position) {
  return document.getElementById('tile-' + position.x + '-' + position.y)
}


/**
 * Visually moves a DOM element to the position of a specified tile.
 *
 * @param {object} $el - Element to manipulate.
 * @param {object} position - Object containing 'x' and 'y' properties.
 * @return {boolean}
 */
export function moveElementToTile($el, position, offsetTop=0, offsetLeft=0) {
  if (!$el)
    return false

  const $tile = getTileElement(position)
  if (!$tile)
    return false

  $el.style.top = $tile.offsetTop - offsetTop + 'px'
  $el.style.left = $tile.offsetLeft - offsetLeft + 'px'

  return true
}


/**
 * Helper function for animating a game object's DOM element.
 * Callback should accept arguments ($el, timeline, wasCancelled)
 *
 * @param {object} gameObject - A game object.
 * @param {function} callback - Called with helpful arguments.
 * @return {boolean}
 */
export async function animate(gameObject, callback) {
  const $el = getObjectElement(gameObject)
  if ($el == null)
    return false

  // Ensure callback is actually a function
  if (typeof callback != 'function')
    return false

  // Add a hook to be ran on visual step
  gameObject.addHook(async (wasCancelled) => {
    // If there are any ongoing tweens for our element, well they're gone now
    TweenLite.killTweensOf($el)

    const timeline = new TimelineLite()

    // Call the callback with 'this' being the gameObject
    // we'll also pass in the game object's element, a greensock timeline for
    // animations, and a function to check if a state update has happened and
    // if it needs to cancel.
    await callback.call(gameObject, $el, timeline, wasCancelled)

    // Clean up timeline animations.
    return () => {
      timeline.pause(0)
      timeline.clear()
    }
  })

  return true
}


/**
 * Visually move game object's element along a path.
 *
 * @param {object} gameObject - A game object.
 * @param {array[position]} path - Array of positions.
 * @return {boolean}
 */
export async function walkAnimation(gameObject, path) {
  // Ignore zero-length paths
  const len = path.length
  if (!len)
    return false

  // Calculate wait time per movement
  const waitMs = window.stepDuration / len

  // This animate helper function fetches the element for us
  animate(gameObject, async ($el, timeline, wasCancelled) => {
    // We can't animate a non-element
    if (!$el)
      return

    // Get sprite for its 'offsetTop' property
    const $sprite = $el.getElementsByClassName('gidget-sprite')[0]
    if (!$sprite)
      return

    // Loop over each position in the path array
    for (var i = 0; i < len; i++) {
      // Ensure operation isn't cancelled (more checks is always better)
      if (wasCancelled())
        return

      // With less than one position to move to, there is no need to wait
      if (len > 1)
        await wait(waitMs);

      // Ensure the operation hasn't been cancelled (a lot can happen during a
      // wait sequence) and then move the element to the specified tile
      if (!wasCancelled())
        moveElementToTile($el, path[i], $sprite.offsetTop)
    }
  })

  return true
}
