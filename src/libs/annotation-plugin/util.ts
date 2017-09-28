// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// This is a modified copy of
// https://github.com/openannotation/annotator/blob/v1.2.x/src/util.coffee

declare const $: any;

import {findChild, simpleXPathJQuery, simpleXPathPure} from './xpath';

const Util: any = {};

// Public: Flatten a nested array structure
//
// Returns an array
Util.flatten = function(array) {
  let flatten = function(ary) {
    let flat = [];

    for (let el of Array.from(ary)) {
      flat = flat.concat(el && $.isArray(el) ? flatten(el) : el);
    }

    return flat;
  };

  return flatten(array);
};

// Public: Finds all text nodes within the elements in the current collection.
//
// Returns a new jQuery collection of text nodes.
Util.getTextNodes = function(jq) {
  let getTextNodes = function(node) {
    if (node && (node.nodeType !== Node.TEXT_NODE)) {
      const nodes = [];

      // If not a comment then traverse children collecting text nodes.
      // We traverse the child nodes manually rather than using the .childNodes
      // property because IE9 does not update the .childNodes property after
      // .splitText() is called on a child text node.
      if (node.nodeType !== Node.COMMENT_NODE) {
        // Start at the last child and walk backwards through siblings.
        node = node.lastChild;
        while (node) {
          nodes.push(getTextNodes(node));
          node = node.previousSibling;
        }
      }

      // Finally reverse the array so that nodes are in the correct order.
      return nodes.reverse();
    } else {
      return node;
    }
  };

  return jq.map(function() { return Util.flatten(getTextNodes(this)); });
};

// Public: determine the last text node inside or before the given node
Util.getLastTextNodeUpTo = function(n) {
  switch (n.nodeType) {
    case Node.TEXT_NODE:
      return n; // We have found our text node.
    case Node.ELEMENT_NODE:
      // This is an element, we need to dig in
      if (n.lastChild != null) { // Does it have children at all?
        const result = Util.getLastTextNodeUpTo(n.lastChild);
        if (result != null) { return result; }
      }
      break;
    default:
  }
  // Not a text node, and not an element node.
  // Could not find a text node in current node, go backwards
  n = n.previousSibling;
  if (n != null) {
    return Util.getLastTextNodeUpTo(n);
  } else {
    return null;
  }
};

// Public: determine the first text node in or after the given jQuery node.
Util.getFirstTextNodeNotBefore = function(n) {
  switch (n.nodeType) {
    case Node.TEXT_NODE:
      return n; // We have found our text node.
    case Node.ELEMENT_NODE:
      // This is an element, we need to dig in
      if (n.firstChild != null) { // Does it have children at all?
        const result = Util.getFirstTextNodeNotBefore(n.firstChild);
        if (result != null) { return result; }
      }
      break;
    default:
  }
  // Not a text or an element node.
  // Could not find a text node in current node, go forward
  n = n.nextSibling;
  if (n != null) {
    return Util.getFirstTextNodeNotBefore(n);
  } else {
    return null;
  }
};

Util.xpathFromNode = function(el, relativeRoot) {
  let result;
  relativeRoot = relativeRoot || document.body;
  try {
    result = simpleXPathJQuery.call(el, relativeRoot);
  } catch (exception) {
    console.log("jQuery-based XPath construction failed! Falling back to manual.");
    result = simpleXPathPure.call(el, relativeRoot);
  }
  return result;
};

Util.nodeFromXPath = function(xp, root) {
  const steps = xp.substring(1).split("/");
  let node = root || document.body;
  for (let step of Array.from(steps)) {

    let [name, idx] = Array.from(step.split("["));

    idx = (idx != null) ? parseInt((idx != null ? idx.split("]") : undefined)[0]) : 1;

    console.log('finding node ', node, ' from index ', idx);
    node = findChild(node, name.toLowerCase(), idx);
  }

  return node;
};

export default Util;
