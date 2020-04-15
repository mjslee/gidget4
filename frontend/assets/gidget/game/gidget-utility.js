import { TweenLite, TimelineLite } from 'gsap';


/**
 * (await) Waits for milliseconds.
 *
 * @param {ms} Milliseconds to wait for.
 * @return {void}
 *
 * @example
 *   async () => await wait(1000)  // Waits for one second
 */
export async function wait(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}



/**
 * Compares two position objects.
 *
 * @param {object} pos1 - A position object to compare.
 * @param {object} pos2 - A position object to compare.
 * @return {boolean} True if positions are equal.
 *
 * @example
 *   poscmp({x:1,y:2}, {x:1,y:2})  // true
 *   poscmp({x:0,y:0}, {x:1,y:2})  // false
 */
export function poscmp(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y
}


/**
 * Gets DOM element ID associated with a game object.
 *
 * @param {object} gameObject - A game object.
 * @return {element} DOM element of game object.
 */
export function getObjectElementId({ name, type, id }) {
  return `object-${name}-${type}-${id}`;
}


/**
 * Gets DOM element of a game object.
 *
 * @param {object} gameObject - A game object.
 * @return {element} DOM element of game object.
 */
export function getObjectElement(gameObject) {
  return document.getElementById(getObjectElementId(gameObject));
}


/**
 * Gets DOM element of a tile.
 *
 * @param {object} position - Object containing 'x' and 'y' properties.
 * @return {element} DOM element of tile.
 */
export function getTileElement(position) {
  return document.getElementById('tile-' + position.x + '-' + position.y);
}


/**
 * Visually moves a DOM element to the position of a specified tile aligned
 * bottom center.
 *
 * @param {object} $el - Element to manipulate.
 * @param {object} position - Object containing 'x' and 'y' properties.
 * @return {boolean}
 */
export function moveElementToTile($el, position) {
  if (!$el)
    return false;

  const $tile = getTileElement(position);
  if (!$tile)
    return false;

  $el.style.top = $tile.offsetTop - ($el.scrollHeight - $tile.scrollHeight) + 'px';
  $el.style.left = $tile.offsetLeft - (($el.scrollWidth - $tile.scrollWidth) / 2) + 'px';

  return true;
}


/**
 * Helper function for animating a game object's DOM element.
 * Callback should accept arguments ($el, timeline, wasInterrupted)
 *
 * @param {object} gameObject - A game object.
 * @param {function} callback - Called with helpful arguments.
 * @return {boolean}
 */
export async function animate(gameObject, callback) {
  const $el = getObjectElement(gameObject);
  if ($el == null)
    return false;

  // Ensure callback is actually a function
  if (typeof callback != 'function')
    return false;

  // Add a hook to be ran on visual step
  const func = async (wasInterrupted) => {
    // If there are any ongoing tweens for our element, well they're gone now
    TweenLite.killTweensOf($el);

    const timeline = new TimelineLite();

    // Animation helper, will throw an error to stop our animations if our
    // animation is interrupted
    const tween = async (ms, vars, prop='to') => {
      if (wasInterrupted()) throw 'INTERRUPT';
      timeline[prop]($el, ms / 1000, vars);
      if (wasInterrupted()) throw 'INTERRUPT';
      await wait(ms);
    }

    // Call the callback with 'this' being the gameObject; we'll also pass in
    // the game object's element, a greensock timeline for animations, and a
    // function to check if a state update has happened and if it needs to
    // cancel.
    try {
      await callback.call(gameObject, tween, $el, wasInterrupted, timeline);
    }

    catch (e) {
      // Ignore INTERRUPTs from the animator
      if (e !== 'INTERRUPT')
        throw e;
    }

    finally {
      // Reset timeline
      timeline.pause(0);
      timeline.clear();
      timeline.invalidate();
    }
  }

  if (typeof gameObject.world == 'object')
    gameObject.world.hooks.push({ callback: func, when: 'before' });

  return true;
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
  const len = path.length;
  if (!len)
    return false;

  // Calculate wait time per movement
  const waitMs = window.stepDuration / len;

  // TODO: Re-write this to not use animate (since timeline isn't even used
  // here) or re-write to use timeline
  // This animate helper function fetches the element for us
  animate(gameObject, async (_, $el, wasInterrupted) => {
    // We can't animate a non-element
    if (!$el)
      return;

    // Get sprite for its 'offsetTop' property
    const $sprite = $el.getElementsByClassName('gidget-sprite')[0];
    if (!$sprite)
      return;

    // Loop over each position in the path array
    for (let i = 0; i < len; i++) {
      // Ensure operation isn't cancelled (more checks is always better)
      if (wasInterrupted())
        return;

      // With less than one position to move to, there is no need to wait
      if (len > 1)
        await wait(waitMs);

      // Ensure the operation hasn't been cancelled (a lot can happen during a
      // wait sequence) and then move the element to the specified tile
      if (!wasInterrupted())
        moveElementToTile($el, path[i], $sprite.offsetTop);
    }
  });

  return true;
}
