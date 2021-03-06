// Generated by CoffeeScript 1.7.1
(function () {
  var $, Util;

  $ = window.jQuery;

  Util = {};

  Util.NodeTypes = {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  };

  Util.getFirstTextNodeNotBefore = function (n) {
    var result;
    switch (n.nodeType) {
      case Util.NodeTypes.TEXT_NODE:
        return n;
      case Util.NodeTypes.ELEMENT_NODE:
        if (n.firstChild != null) {
          result = Util.getFirstTextNodeNotBefore(n.firstChild);
          if (result != null) {
            return result;
          }
        }
        break;
    }
    n = n.nextSibling;
    if (n != null) {
      return Util.getFirstTextNodeNotBefore(n);
    } else {
      return null;
    }
  };

  Util.getLastTextNodeUpTo = function (n) {
    var result;
    switch (n.nodeType) {
      case Util.NodeTypes.TEXT_NODE:
        return n;
      case Util.NodeTypes.ELEMENT_NODE:
        if (n.lastChild != null) {
          result = Util.getLastTextNodeUpTo(n.lastChild);
          if (result != null) {
            return result;
          }
        }
        break;
    }
    n = n.previousSibling;
    if (n != null) {
      return Util.getLastTextNodeUpTo(n);
    } else {
      return null;
    }
  };

  Util.getTextNodes = function (jq) {
    var getTextNodes;
    getTextNodes = function (node) {
      var nodes;
      if (node && node.nodeType !== Util.NodeTypes.TEXT_NODE) {
        nodes = [];
        if (node.nodeType !== Util.NodeTypes.COMMENT_NODE) {
          node = node.lastChild;
          while (node) {
            nodes.push(getTextNodes(node));
            node = node.previousSibling;
          }
        }
        return nodes.reverse();
      } else {
        return node;
      }
    };
    return jq.map(function () {
      return Util.flatten(getTextNodes(this));
    });
  };

  Util.getGlobal = function () {
    return (function () {
      return this;
    })();
  };

  Util.contains = function (parent, child) {
    var node;
    node = child;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  Util.flatten = function (array) {
    var flatten;
    flatten = function (ary) {
      var el, flat, _i, _len;
      flat = [];
      for (_i = 0, _len = ary.length; _i < _len; _i++) {
        el = ary[ _i ];
        flat = flat.concat(el && $.isArray(el) ? flatten(el) : el);
      }
      return flat;
    };
    return flatten(array);
  };

  module.exports = Util;

}).call(this);
