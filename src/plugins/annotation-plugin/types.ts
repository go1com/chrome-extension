import * as domAnchorTextPosition from './dom-anchor-text-position';
import * as domAnchorTextQuote from './dom-anchor-text-quote';

import xpathRange from './range';

// Helper function for throwing common errors
const missingParameter = function (name) {
  throw new Error(`missing required parameter "${name}"`);
};

export class FragmentAnchor {
  root: any;
  id: any;

  static fromRange(root, range) {
    if (root === undefined) {
      throw new Error('missing required parameter "root"');
    }
    if (range === undefined) {
      throw new Error('missing required parameter "range"');
    }

    let el = range.commonAncestorContainer;
    while (el != null && !el.id) {
      if (root.compareDocumentPosition(el) && Node.DOCUMENT_POSITION_CONTAINED_BY) {
        el = el.parentElement;
      } else {
        throw new Error('no fragment identifier found');
      }
    }

    return new FragmentAnchor(root, el.id);
  }

  static fromSelector(root, selector: any = {}) {
    return new FragmentAnchor(root, selector.value);
  }

  constructor(root, id) {
    if (root === undefined) {
      throw new Error('missing required parameter "root"');
    }
    if (id === undefined) {
      throw new Error('missing required parameter "id"');
    }

    this.root = root;
    this.id = id;
  }

  toRange() {
    const el = this.root.querySelector('#' + this.id);
    if (el == null) {
      throw new Error('no element found with id "' + this.id + '"');
    }

    const range = this.root.ownerDocument.createRange();
    range.selectNodeContents(el);

    return range;
  }

  toSelector() {
    const el = this.root.querySelector('#' + this.id);
    if (el == null) {
      throw new Error('no element found with id "' + this.id + '"');
    }

    let conformsTo = 'https://tools.ietf.org/html/rfc3236';
    if (el instanceof SVGElement) {
      conformsTo = 'http://www.w3.org/TR/SVG/';
    }

    return {
      type: 'FragmentSelector',
      value: this.id,
      conformsTo: conformsTo,
    };
  }
}

/**
 * class:: RangeAnchor(range)
 *
 * This anchor type represents a DOM Range.
 *
 * :param Range range: A range describing the anchor.
 */
export class RangeAnchor {
  range: any;
  private root: any;

  static fromRange(root, range) {
    return new RangeAnchor(root, range);
  }

  // Create and anchor using the saved Range selector.
  static fromSelector(root, selector) {
    const data = {
      start: selector.startContainer,
      startOffset: selector.startOffset,
      end: selector.endContainer,
      endOffset: selector.endOffset
    };
    const range = new xpathRange.SerializedRange(data);
    return new RangeAnchor(root, range);
  }

  constructor(root, range) {
    if (root === null) {
      missingParameter('root');
    }
    if (range == null) {
      missingParameter('range');
    }
    this.root = root;
    this.range = xpathRange.sniff(range).normalize(this.root);
  }

  toRange() {
    return this.range.toRange();
  }

  toSelector(options) {
    if (options == null) {
      options = {};
    }
    const range = this.range.serialize(this.root, options.ignoreSelector);
    return {
      type: 'RangeSelector',
      startContainer: range.start,
      startOffset: range.startOffset,
      endContainer: range.end,
      endOffset: range.endOffset
    };
  }
}

/**
 * Converts between TextPositionSelector selectors and Range objects.
 */
export class TextPositionAnchor {
  end: any;
  root: any;
  start: any;

  static fromRange(root, range) {
    const selector = domAnchorTextPosition.fromRange(root, range);
    return TextPositionAnchor.fromSelector(root, selector);
  }

  static fromSelector(root, selector) {
    return new TextPositionAnchor(root, selector.start, selector.end);
  }

  constructor(root, start, end) {
    this.root = root;
    this.start = start;
    this.end = end;
  }

  toSelector() {
    return {
      type: 'TextPositionSelector',
      start: this.start,
      end: this.end,
    };
  }

  toRange() {
    return domAnchorTextPosition.toRange(this.root, {start: this.start, end: this.end});
  }
}

/**
 * Converts between TextQuoteSelector selectors and Range objects.
 */
export class TextQuoteAnchor {
  context: any;
  exact: any;
  root: any;

  static fromRange(root, range) {
    const selector = domAnchorTextQuote.fromRange(root, range);
    return TextQuoteAnchor.fromSelector(root, selector);
  }

  static fromSelector(root, selector) {
    const {prefix, suffix} = selector;
    return new TextQuoteAnchor(root, selector.exact, {prefix, suffix});
  }

  constructor(root, exact, context) {
    if (context == null) {
      context = {};
    }
    this.root = root;
    this.exact = exact;
    this.context = context;
  }

  toSelector() {
    return {
      type: 'TextQuoteSelector',
      exact: this.exact,
      prefix: this.context.prefix,
      suffix: this.context.suffix,
    };
  }

  toRange(options) {
    if (options == null) {
      options = {};
    }
    const range = domAnchorTextQuote.toRange(this.root, this.toSelector(), options);
    if (range === null) {
      throw new Error('Quote not found');
    }
    return range;
  }

  toPositionAnchor(options) {
    if (options == null) {
      options = {};
    }
    const anchor = domAnchorTextQuote.toTextPosition(this.root, this.toSelector(), options);
    if (anchor === null) {
      throw new Error('Quote not found');
    }
    return new TextPositionAnchor(this.root, anchor.start, anchor.end);
  }
}
