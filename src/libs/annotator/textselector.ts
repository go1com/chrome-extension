import xpathRange from './xpath-range/lib';

declare const $: any;

const TEXTSELECTOR_NS = 'annotator-textselector';


// TextSelector monitors a document (or a specific element) for text selections
// and can notify another object of a selection event
export class TextSelector {
  // Configuration options
  static options = {
    // Callback, called when the user makes a selection.
    // Receives the list of selected ranges (may be empty) and  the DOM Event
    // that was detected as a selection.
    onSelection: null,
    highlightClass: 'annotator-hl'
  };

  document: any;
  element: any;
  options: any;
  onSelection: any;

  constructor(element, options) {
    this.element = element;
    this.options = $.extend(true, {}, TextSelector.options, options);
    this.onSelection = this.options.onSelection;

    if (typeof this.element.ownerDocument !== 'undefined' &&
      this.element.ownerDocument !== null) {
      const self = this;
      this.document = this.element.ownerDocument;

      $(this.document.body)
        .on("mouseup." + TEXTSELECTOR_NS, function (e) {
          self._checkForEndSelection(e);
        });
    } else {
      console.warn("You created an instance of the TextSelector on an " +
        "element that doesn't have an ownerDocument. This won't " +
        "work! Please ensure the element is added to the DOM " +
        "before the plugin is configured:", this.element);
    }
  }

  destroy() {
    if (this.document) {
      $(this.document.body).off("." + TEXTSELECTOR_NS);
    }
  }

  // Public: capture the current selection from the document, excluding any nodes
  // that fall outside of the adder's `element`.
  //
  // Returns an Array of NormalizedRange instances.
  captureDocumentSelection() {
    let i,
      len;

    const ranges = [],
      rangesToIgnore = [],
      selection = window.getSelection();

    if (selection.isCollapsed) {
      return [];
    }

    for (i = 0; i < selection.rangeCount; i++) {
      const r = selection.getRangeAt(i),
        browserRange = new xpathRange.Range.BrowserRange(r),
        normedRange = browserRange.normalize();//.limit(this.element);

      // If the new range falls fully outside our this.element, we should
      // add it back to the document but not return it from this method.
      if (normedRange === null) {
        rangesToIgnore.push(r);
      } else {
        ranges.push(normedRange);
      }
    }

    // BrowserRange#normalize() modifies the DOM structure and deselects the
    // underlying text as a result. So here we remove the selected ranges and
    // reapply the new ones.
    selection.removeAllRanges();

    for (i = 0, len = rangesToIgnore.length; i < len; i++) {
      selection.addRange(rangesToIgnore[i]);
    }

    // Add normed ranges back to the selection
    for (i = 0, len = ranges.length; i < len; i++) {
      const range = ranges[i],
        drange = this.document.createRange();
      drange.setStartBefore(range.start);
      drange.setEndAfter(range.end);
      selection.addRange(drange);
    }


    return ranges;
  };

  // Event callback: called when the mouse button is released. Checks to see if a
  // selection has been made and if so displays the adder.
  //
  // event - A mouseup Event object.
  //
  // Returns nothing.
  _checkForEndSelection(event) {
    const self = this;

    const _nullSelection = function () {
      if (typeof self.onSelection === 'function') {
        self.onSelection([], event);
      }
    };

    // Get the currently selected ranges.
    const selectedRanges = this.captureDocumentSelection();

    if (selectedRanges.length === 0) {
      _nullSelection();
      return;
    }

    // Don't show the adder if the selection was of a part of Annotator itself.
    for (let i = 0, len = selectedRanges.length; i < len; i++) {
      let container = selectedRanges[i].commonAncestor;
      if ($(container).hasClass(this.options.highlightClass)) {
        container = $(container).parents(`[class!=${this.options.highlightClass}]`)[0];
      }

      if (this.isAnnotator(container)) {
        _nullSelection();
        return;
      }
    }

    if (typeof this.onSelection === 'function') {
      this.onSelection(selectedRanges, event);
    }
  }

  // isAnnotator determines if the provided element is part of Annotator. Useful
  // for ignoring mouse actions on the annotator elements.
  //
  // element - An Element or TextNode to check.
  //
  // Returns true if the element is a child of an annotator element.
  private isAnnotator(element) {
    const elAndParents = $(element).parents().addBack();
    return (elAndParents.filter(`[class^=${this.options.highlightClass}]`).length !== 0);
  }
}
