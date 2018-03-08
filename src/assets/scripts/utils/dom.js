import detectIt from 'detect-it';

export {
  qs,
  qsa,
  $parent,
  $offset,
  $outerWidth,
  $outerHeight,
  $insertAfter,
  $wrap,
  $siblings,
  $nextSiblings,
  $on,
  $off,
  $delegate,
  forEach,
  map,
};

/**
 * Get element by CSS selector.
 *
 * @param {String} selector CSS selector
 * @param {HTMLElement} scope DOM element to query inside
 * @returns {HTMLElement} queried DOM element
 */
function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

/**
 * Get elements by CSS selector.
 *
 * @param {String} selector CSS selector
 * @param {HTMLElement} scope DOM element to query inside
 * @returns {NodeList} queried DOM elements
 */
function qsa(selector, scope) {
  return (scope || document).querySelectorAll(selector);
}

/**
 * Find the element's parent with the given CSS selector
 *
 * @param {HTMLElement} element child element
 * @param {String} selector CSS selector
 * @returns {HTMLElement|undefined} parent DOM Element
 * @example
 * $parent(qs('a'), 'div');
 */
function $parent(element, selector) {
  if (!element.parentNode || typeof element.parentNode.matches !== 'function') {
    return undefined;
  }

  if (element.parentNode.matches(selector)) {
    return element.parentNode;
  }

  return $parent(element.parentNode, selector);
}

/**
 * Get element's offset
 *
 * @param {HTMLElement} element DOM element
 * @returns {Object} top and left values
 */
function $offset(element) {
  return {
    top: element.getBoundingClientRect().top + document.body.scrollTop,
    left: element.getBoundingClientRect().left + document.body.scrollLeft,
  };
}

/**
* Get element's height including margins
*
* @param {HTMLElement} element DOM element
* @returns {number} height
*/
function $outerWidth(element) {
  let width = element.offsetWidth;
  const style = getComputedStyle(element);

  width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);

  return width;
}

/**
 * Get element's height including margins
 *
 * @param {HTMLElement} element DOM element
 * @returns {number} width
 */
function $outerHeight(element) {
  let height = element.offsetHeight;
  const style = getComputedStyle(element);

  height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);

  return height;
}

/**
 * Insert an element after another.
 *
 * @param {HTMLElement} newElement DOM element to insert
 * @param {HTMLElement} referenceElement reference DOM element
 * @returns {undefined}
 */
function $insertAfter(newElement, referenceElement) {
  referenceElement
    .parentNode
    .insertBefore(newElement, referenceElement.nextSibling);
}

/**
 * Wrap a given element in a new container element.
 *
 * @param {HTMLElement} element DOM element to be wrapped
 * @param {HTMLElement} wrapper DOM container element
 * @returns {undefined}
 */
function $wrap(element, wrapper) {
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
}

/**
 * Get element's siblings.
 *
 * @param {HTMLElement} element DOM element to find siblings
 * @returns {Array} siblings
 */
function $siblings(element) {
  return [...element.parentNode.children].filter(child => child !== element);
}

/**
* Get element's next siblings.
*
* @param {HTMLElement} element DOM element to find siblings
* @returns {Array} next siblings
*/
function $nextSiblings(element) {
  const siblings = [];
  let sibling = element.nextElementSibling;

  while (sibling) {
    siblings.push(sibling);
    sibling = sibling.nextElementSibling;
  }

  return siblings;
}

/**
 * Add Event Listener wrapper.
 *
 * @param {HTMLElement} target DOM target element
 * @param {String} type event type
 * @param {Function} callback callback
 * @param {Object} opts EventListenerOptions
 * @returns {undefined}
 */
function $on(target, type, callback, opts = { capture: false }) {
  // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
  const options = detectIt.passiveEvents === true ? opts : opts.capture;

  target.addEventListener(type, callback, options);
}

/**
 * Remove Event Listener.
 *
 * @param {HTMLElement} target DOM target element
 * @param {String} type event type
 * @param {Function} callback callback
 * @returns {undefined}
 */
function $off(target, type, callback) {
  target.removeEventListener(type, callback);
}

/**
* Attach a handler to event for all elements that match the selector, now or in the future, based on a root element.
*
* @param {HTMLElement} target DOM root element
* @param {String} selector CSS selector
* @param {String} type event type
* @param {Function} handler handler
* @returns {undefined}
*/
function $delegate(target, selector, type, handler) {
  // https://developer.mozilla.org/en-US/docs/Web/Events/blur
  const useCapture = type === 'blur' || type === 'focus';

  $on(target, type, dispatchEvent, useCapture);

  /**
   * Callback
   *
   * @param {Event} event triggered event
   * @returns {*} handler return
   */
  function dispatchEvent(event) {
    const targetElement = event.target;
    const potentialElements = qsa(selector, target);
    const hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

    if (hasMatch) {
      handler.call(targetElement, event);
    }
  }
}

/**
 * ForEach for array/object (basic version)
 *
 * @param {Array|Object} collection "collection" to loop over
 * @param {Function} iteratee callback
 * @returns {Array|Object} initial collection
 */
function forEach(collection, iteratee) {
  if (collection.forEach === undefined) {
    Object.keys(collection).forEach(key => {
      iteratee(collection[key], key);
    });
  } else {
    collection.forEach(iteratee);
  }

  return collection;
}

/**
 * Map for array/object (basic version)
 *
 * @param {Array|Object} collection "collection" to loop over
 * @param {Function} iteratee callback
 * @returns {Array} "mapped" array
 */
function map(collection, iteratee) {
  if (collection.map === undefined) {
    return Object.keys(collection).map(key => iteratee(collection[key], key));
  }

  return collection.map(iteratee);
}
