const E_SHOW = 'Argument 1 of seek must use filter NodeFilter.SHOW_TEXT.';
const E_WHERE = 'Argument 2 of seek must be a number or a Text Node.';

const SHOW_TEXT = 4;
const TEXT_NODE = 3;

function parents(node, filter) {
  var out = []

  filter = filter || noop

  do {
    out.push(node)
    node = node.parentNode
  } while(node && node.tagName && filter(node))

  return out.slice(1)
}

function noop(n) {
  return true
}


function indexOf(arr, ele, start) {
  start = start || 0;
  var idx = -1;

  if (arr === null) return idx;
  var len = arr.length;
  var i = start < 0
    ? (len + start)
    : start;

  if (i >= arr.length) {
    return -1;
  }

  while (i < len) {
    if (arr[i] === ele) {
      return i;
    }
    i++;
  }

  return -1;
}

const ancestors = parents;

export default function seek(iter, where) {
  if (iter.whatToShow !== SHOW_TEXT) {
    throw new Error(E_SHOW)
  }

  let count = 0
  let node = iter.referenceNode
  let predicates = null

  if (isNumber(where)) {
    predicates = {
      forward: () => count < where,
      backward: () => count > where,
    }
  } else if (isText(where)) {
    let forward = before(node, where) ? () => false : () => node !== where
    let backward = () => node != where || !iter.pointerBeforeReferenceNode
    predicates = {forward, backward}
  } else {
    throw new Error(E_WHERE)
  }

  while (predicates.forward() && (node = iter.nextNode()) !== null) {
    count += node.nodeValue.length
  }

  while (predicates.backward() && (node = iter.previousNode()) !== null) {
    count -= node.nodeValue.length
  }

  return count
}


function isNumber(n) {
  return !isNaN(parseInt(n)) && isFinite(n)
}


function isText(node) {
  return node.nodeType === TEXT_NODE
}


function before(ref, node) {
  if (ref === node) return false

  let common = null
  let left = [ref].concat(ancestors(ref)).reverse()
  let right = [node].concat(ancestors(node)).reverse()

  while (left[0] === right[0]) {
    common = left.shift()
    right.shift()
  }

  left = left[0]
  right = right[0]

  let l = indexOf(common.childNodes, left)
  let r = indexOf(common.childNodes, right)

  return l > r
}
