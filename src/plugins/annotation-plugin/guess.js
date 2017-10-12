let Guest;
const baseURI = require('document-base-uri');
const extend = require('extend');
const raf = require('raf');
const scrollIntoView = require('scroll-into-view');
const CustomEvent = require('custom-event');

const Delegator = require('./delegator');
const $ = require('jquery');

const adder = require('./adder');
const highlighter = require('./highlighter');
const rangeUtil = require('./range-util');
const selections = require('./selections');
const xpathRange = require('./anchoring/range');

const animationPromise = fn =>
  new Promise(function(resolve, reject) {
    return raf(function() {
      try {
        return resolve(fn());
      } catch (error) {
        return reject(error);
      }
    });
  })
;

// Normalize the URI for an annotation. This makes it absolute and strips
// the fragment identifier.
const normalizeURI = function(uri, baseURI) {
  // Convert to absolute URL
  const url = new URL(uri, baseURI);
  // Remove the fragment identifier.
  // This is done on the serialized URL rather than modifying `url.hash` due
  // to a bug in Safari.
  // See https://github.com/hypothesis/h/issues/3471#issuecomment-226713750
  return url.toString().replace(/#.*/, '');
};

module.exports = (Guest = (function() {
  let SHOW_HIGHLIGHTS_CLASS = undefined;
  Guest = class Guest extends Delegator {
    static initClass() {
      SHOW_HIGHLIGHTS_CLASS = 'annotator-highlights-always-on';

      // Events to be bound on Delegator#element.
      this.prototype.events = {
        ".annotator-hl click":               "onHighlightClick",
        ".annotator-hl mouseover":           "onHighlightMouseover",
        ".annotator-hl mouseout":            "onHighlightMouseout",
        "click":                             "onElementClick",
        "touchstart":                        "onElementTouchStart"
      };

      this.prototype.options = {
        Document: {},
        TextSelection: {}
      };

      // Anchoring module
      this.prototype.anchoring = require('./anchoring/html');

      // Internal state
      this.prototype.plugins = null;
      this.prototype.anchors = null;
      this.prototype.visibleHighlights = false;
      this.prototype.frameIdentifier = null;

      this.prototype.html =
        {adder: '<hypothesis-adder></hypothesis-adder>'};
    }

    constructor(element, config) {
      super(...arguments);

      this.adder = $(this.html.adder).appendTo(this.element).hide();

      const self = this;
      this.adderCtrl = new adder.Adder(this.adder[0], {
        onAnnotate() {
          self.createAnnotation();
          return document.getSelection().removeAllRanges();
        },
        onHighlight() {
          self.setVisibleHighlights(true);
          self.createHighlight();
          return document.getSelection().removeAllRanges();
        }
      });
      this.selections = selections(document).subscribe({
        next(range) {
          if (range) {
            return self._onSelection(range);
          } else {
            return self._onClearSelection();
          }
        }
      });

      this.plugins = {};
      this.anchors = [];

      // Set the frame identifier if it's available.
      // The "top" guest instance will have this as null since it's in a top frame not a sub frame
      this.frameIdentifier = config.subFrameIdentifier || null;

      const cfOptions = {
        config,
        on: (event, handler) => {
          return this.subscribe(event, handler);
        },
        emit: (event, ...args) => {
          return this.publish(event, args);
        }
      };

      this.addPlugin('CrossFrame', cfOptions);
      this.crossframe = this.plugins.CrossFrame;

      this.crossframe.onConnect(() => this._setupInitialState(config));
      this._connectAnnotationSync(this.crossframe);
      this._connectAnnotationUISync(this.crossframe);

      // Load plugins
      for (let name of Object.keys(this.options || {})) {
        const opts = this.options[name];
        if (!this.plugins[name] && this.options.pluginClasses[name]) {
          this.addPlugin(name, opts);
        }
      }
    }

    addPlugin(name, options) {
      if (this.plugins[name]) {
        console.error("You cannot have more than one instance of any plugin.");
      } else {
        const klass = this.options.pluginClasses[name];
        if (typeof klass === 'function') {
          this.plugins[name] = new klass(this.element[0], options);
          this.plugins[name].annotator = this;
          if (typeof this.plugins[name].pluginInit === 'function') {
            this.plugins[name].pluginInit();
          }
        } else {
          console.error(`Could not load ${name} plugin. Have you included the appropriate <script> tag?`);
        }
      }
      return this; // allow chaining
    }

    // Get the document info
    getDocumentInfo() {
      let metadataPromise, uriPromise;
      if (this.plugins.PDF != null) {
        metadataPromise = Promise.resolve(this.plugins.PDF.getMetadata());
        uriPromise = Promise.resolve(this.plugins.PDF.uri());
      } else if (this.plugins.Document != null) {
        uriPromise = Promise.resolve(this.plugins.Document.uri());
        metadataPromise = Promise.resolve(this.plugins.Document.metadata);
      } else {
        uriPromise = Promise.reject();
        metadataPromise = Promise.reject();
      }

      uriPromise = uriPromise.catch(() => decodeURIComponent(window.location.href));
      metadataPromise = metadataPromise.catch(() => ({
        title: document.title,
        link: [{href: decodeURIComponent(window.location.href)}]
      }) );

      return Promise.all([metadataPromise, uriPromise]).then((...args) => {
        const [metadata, href] = Array.from(args[0]);
        return {
          uri: normalizeURI(href, baseURI),
          metadata,
          frameIdentifier: this.frameIdentifier
        };
      });
    }

    _setupInitialState(config) {
      this.publish('panelReady');
      return this.setVisibleHighlights(config.showHighlights === 'always');
    }

    _connectAnnotationSync(crossframe) {
      this.subscribe('annotationDeleted', annotation => {
        return this.detach(annotation);
      });

      return this.subscribe('annotationsLoaded', annotations => {
        return Array.from(annotations).map((annotation) =>
          this.anchor(annotation));
      });
    }

    _connectAnnotationUISync(crossframe) {
      let anchor, result;
      crossframe.on('focusAnnotations', tags => {
        if (tags == null) { tags = []; }
        return (() => {
          result = [];
          for (anchor of Array.from(this.anchors)) {
            if (anchor.highlights != null) {
              const toggle = Array.from(tags).includes(anchor.annotation.$tag);
              result.push($(anchor.highlights).toggleClass('annotator-hl-focused', toggle));
            }
          }
          return result;
        })();
      });

      crossframe.on('scrollToAnnotation', tag => {
        return (() => {
          result = [];
          for (anchor of Array.from(this.anchors)) {
            if (anchor.highlights != null) {
              if (anchor.annotation.$tag === tag) {
                const event = new CustomEvent('scrolltorange', {
                  bubbles: true,
                  cancelable: true,
                  detail: anchor.range
                });
                const defaultNotPrevented = this.element[0].dispatchEvent(event);
                if (defaultNotPrevented) {
                  result.push(scrollIntoView(anchor.highlights[0]));
                } else {
                  result.push(undefined);
                }
              } else {
                result.push(undefined);
              }
            }
          }
          return result;
        })();
      });

      crossframe.on('getDocumentInfo', cb => {
        return this.getDocumentInfo()
          .then(info => cb(null, info))
          .catch(reason => cb(reason));
      });

      return crossframe.on('setVisibleHighlights', state => {
        return this.setVisibleHighlights(state);
      });
    }

    destroy() {
      $('#annotator-dynamic-style').remove();

      this.selections.unsubscribe();
      this.adder.remove();

      this.element.find('.annotator-hl').each(function() {
        $(this).contents().insertBefore(this);
        return $(this).remove();
      });

      this.element.data('annotator', null);

      for (let name in this.plugins) {
        const plugin = this.plugins[name];
        this.plugins[name].destroy();
      }

      return super.destroy(...arguments);
    }

    anchor(annotation) {
      const self = this;
      const root = this.element[0];

      // Anchors for all annotations are in the `anchors` instance property. These
      // are anchors for this annotation only. After all the targets have been
      // processed these will be appended to the list of anchors known to the
      // instance. Anchors hold an annotation, a target of that annotation, a
      // document range for that target and an Array of highlights.
      const anchors = [];

      // The targets that are already anchored. This function consults this to
      // determine which targets can be left alone.
      const anchoredTargets = [];

      // These are the highlights for existing anchors of this annotation with
      // targets that have since been removed from the annotation. These will
      // be removed by this function.
      let deadHighlights = [];

      // Initialize the target array.
      if (annotation.target == null) { annotation.target = []; }

      const locate = function(target) {
        // Check that the anchor has a TextQuoteSelector -- without a
        // TextQuoteSelector we have no basis on which to verify that we have
        // reanchored correctly and so we shouldn't even try.
        //
        // Returning an anchor without a range will result in this annotation being
        // treated as an orphan (assuming no other targets anchor).
        if (!(target.selector != null ? target.selector : []).some(s => s.type === 'TextQuoteSelector')) {
          return Promise.resolve({annotation, target});
        }

        // Find a target using the anchoring module.
        const options = {
          cache: self.anchoringCache,
          ignoreSelector: '[class^="annotator-"]'
        };
        return self.anchoring.anchor(root, target.selector, options)
          .then(range => ({annotation, target, range}))
          .catch(() => ({annotation, target}));
      };

      const highlight = function(anchor) {
        // Highlight the range for an anchor.
        if (anchor.range == null) { return anchor; }
        return animationPromise(function() {
          const range = xpathRange.sniff(anchor.range);
          const normedRange = range.normalize(root);
          const highlights = highlighter.highlightRange(normedRange);

          $(highlights).data('annotation', anchor.annotation);
          anchor.highlights = highlights;
          return anchor;
        });
      };

      const sync = function(anchors) {
        // Store the results of anchoring.

        // An annotation is considered to be an orphan if it has at least one
        // target with selectors, and all targets with selectors failed to anchor
        // (i.e. we didn't find it in the page and thus it has no range).
        let hasAnchorableTargets = false;
        let hasAnchoredTargets = false;
        for (let anchor of Array.from(anchors)) {
          if (anchor.target.selector != null) {
            hasAnchorableTargets = true;
            if (anchor.range != null) {
              hasAnchoredTargets = true;
              break;
            }
          }
        }
        annotation.$orphan = hasAnchorableTargets && !hasAnchoredTargets;

        // Add the anchors for this annotation to instance storage.
        self.anchors = self.anchors.concat(anchors);

        // Let plugins know about the new information.
        if (self.plugins.BucketBar != null) {
          self.plugins.BucketBar.update();
        }
        if (self.plugins.CrossFrame != null) {
          self.plugins.CrossFrame.sync([annotation]);
        }

        return anchors;
      };

      // Remove all the anchors for this annotation from the instance storage.
      for (var anchor of Array.from(self.anchors.splice(0, self.anchors.length))) {
        if (anchor.annotation === annotation) {
          // Anchors are valid as long as they still have a range and their target
          // is still in the list of targets for this annotation.
          if ((anchor.range != null) && Array.from(annotation.target).includes(anchor.target)) {
            anchors.push(anchor);
            anchoredTargets.push(anchor.target);
          } else if (anchor.highlights != null) {
            // These highlights are no longer valid and should be removed.
            deadHighlights = deadHighlights.concat(anchor.highlights);
            delete anchor.highlights;
            delete anchor.range;
          }
        } else {
          // These can be ignored, so push them back onto the new list.
          self.anchors.push(anchor);
        }
      }

      // Remove all the highlights that have no corresponding target anymore.
      raf(() => highlighter.removeHighlights(deadHighlights));

      // Anchor any targets of this annotation that are not anchored already.
      for (let target of Array.from(annotation.target)) {
        if (!Array.from(anchoredTargets).includes(target)) {
          anchor = locate(target).then(highlight);
          anchors.push(anchor);
        }
      }

      return Promise.all(anchors).then(sync);
    }

    detach(annotation) {
      const anchors = [];
      const targets = [];
      let unhighlight = [];

      for (let anchor of Array.from(this.anchors)) {
        if (anchor.annotation === annotation) {
          unhighlight.push(anchor.highlights != null ? anchor.highlights : []);
        } else {
          anchors.push(anchor);
        }
      }

      this.anchors = anchors;

      unhighlight = Array.prototype.concat(...Array.from(unhighlight || []));
      return raf(() => {
        highlighter.removeHighlights(unhighlight);
        return (this.plugins.BucketBar != null ? this.plugins.BucketBar.update() : undefined);
      });
    }

    createAnnotation(annotation) {
      if (annotation == null) { annotation = {}; }
      const self = this;
      const root = this.element[0];

      const ranges = this.selectedRanges != null ? this.selectedRanges : [];
      this.selectedRanges = null;

      const getSelectors = function(range) {
        const options = {
          cache: self.anchoringCache,
          ignoreSelector: '[class^="annotator-"]'
        };
        // Returns an array of selectors for the passed range.
        return self.anchoring.describe(root, range, options);
      };

      const setDocumentInfo = function(info) {
        annotation.document = info.metadata;
        return annotation.uri = info.uri;
      };

      const setTargets = function(...args) {
        // `selectors` is an array of arrays: each item is an array of selectors
        // identifying a distinct target.
        let info, selectors;
        [info, selectors] = Array.from(args[0]);
        const source = info.uri;
        return annotation.target = (Array.from(selectors).map((selector) => ({source, selector})));
      };

      const info = this.getDocumentInfo();
      const selectors = Promise.all(ranges.map(getSelectors));

      const metadata = info.then(setDocumentInfo);
      const targets = Promise.all([info, selectors]).then(setTargets);

      targets.then(() => self.publish('beforeAnnotationCreated', [annotation]));
      targets.then(() => self.anchor(annotation));

      if (!annotation.$highlight) { if (this.crossframe != null) {
        this.crossframe.call('showSidebar');
      } }
      return annotation;
    }

    createHighlight() {
      return this.createAnnotation({$highlight: true});
    }

    // Create a blank comment (AKA "page note")
    createComment() {
      const annotation = {};
      const self = this;

      const prepare = function(info) {
        annotation.document = info.metadata;
        annotation.uri = info.uri;
        return annotation.target = [{source: info.uri}];
      };

      this.getDocumentInfo()
        .then(prepare)
        .then(() => self.publish('beforeAnnotationCreated', [annotation]));

      return annotation;
    }

    // Public: Deletes the annotation by removing the highlight from the DOM.
    // Publishes the 'annotationDeleted' event on completion.
    //
    // annotation - An annotation Object to delete.
    //
    // Returns deleted annotation.
    deleteAnnotation(annotation) {
      if (annotation.highlights != null) {
        for (let h of Array.from(annotation.highlights)) {
          if (h.parentNode != null) {
            $(h).replaceWith(h.childNodes);
          }
        }
      }

      this.publish('annotationDeleted', [annotation]);
      return annotation;
    }

    showAnnotations(annotations) {
      const tags = (Array.from(annotations).map((a) => a.$tag));
      if (this.crossframe != null) {
        this.crossframe.call('showAnnotations', tags);
      }
      return (this.crossframe != null ? this.crossframe.call('showSidebar') : undefined);
    }

    toggleAnnotationSelection(annotations) {
      const tags = (Array.from(annotations).map((a) => a.$tag));
      return (this.crossframe != null ? this.crossframe.call('toggleAnnotationSelection', tags) : undefined);
    }

    updateAnnotations(annotations) {
      const tags = (Array.from(annotations).map((a) => a.$tag));
      return (this.crossframe != null ? this.crossframe.call('updateAnnotations', tags) : undefined);
    }

    focusAnnotations(annotations) {
      const tags = (Array.from(annotations).map((a) => a.$tag));
      return (this.crossframe != null ? this.crossframe.call('focusAnnotations', tags) : undefined);
    }

    _onSelection(range) {
      const selection = document.getSelection();
      const isBackwards = rangeUtil.isSelectionBackwards(selection);
      const focusRect = rangeUtil.selectionFocusRect(selection);
      if (!focusRect) {
        // The selected range does not contain any text
        this._onClearSelection();
        return;
      }

      this.selectedRanges = [range];

      $('.annotator-toolbar .h-icon-note')
        .attr('title', 'New Annotation')
        .removeClass('h-icon-note')
        .addClass('h-icon-annotate');

      const {left, top, arrowDirection} = this.adderCtrl.target(focusRect, isBackwards);
      return this.adderCtrl.showAt(left, top, arrowDirection);
    }

    _onClearSelection() {
      this.adderCtrl.hide();
      this.selectedRanges = [];

      return $('.annotator-toolbar .h-icon-annotate')
        .attr('title', 'New Page Note')
        .removeClass('h-icon-annotate')
        .addClass('h-icon-note');
    }

    selectAnnotations(annotations, toggle) {
      if (toggle) {
        return this.toggleAnnotationSelection(annotations);
      } else {
        return this.showAnnotations(annotations);
      }
    }

    onElementClick(event) {
      if (!(this.selectedTargets != null ? this.selectedTargets.length : undefined)) {
        return (this.crossframe != null ? this.crossframe.call('hideSidebar') : undefined);
      }
    }

    onElementTouchStart(event) {
      // Mobile browsers do not register click events on
      // elements without cursor: pointer. So instead of
      // adding that to every element, we can add the initial
      // touchstart event which is always registered to
      // make up for the lack of click support for all elements.
      if (!(this.selectedTargets != null ? this.selectedTargets.length : undefined)) {
        return (this.crossframe != null ? this.crossframe.call('hideSidebar') : undefined);
      }
    }

    onHighlightMouseover(event) {
      if (!this.visibleHighlights) { return; }
      const annotation = $(event.currentTarget).data('annotation');
      const annotations = event.annotations != null ? event.annotations : (event.annotations = []);
      annotations.push(annotation);

      // The innermost highlight will execute this.
      // The timeout gives time for the event to bubble, letting any overlapping
      // highlights have time to add their annotations to the list stored on the
      // event object.
      if (event.target === event.currentTarget) {
        return setTimeout(() => this.focusAnnotations(annotations));
      }
    }

    onHighlightMouseout(event) {
      if (!this.visibleHighlights) { return; }
      return this.focusAnnotations([]);
    }

    onHighlightClick(event) {
      if (!this.visibleHighlights) { return; }
      const annotation = $(event.currentTarget).data('annotation');
      const annotations = event.annotations != null ? event.annotations : (event.annotations = []);
      annotations.push(annotation);

      // See the comment in onHighlightMouseover
      if (event.target === event.currentTarget) {
        const xor = (event.metaKey || event.ctrlKey);
        return setTimeout(() => this.selectAnnotations(annotations, xor));
      }
    }

    // Pass true to show the highlights in the frame or false to disable.
    setVisibleHighlights(shouldShowHighlights) {
      return this.toggleHighlightClass(shouldShowHighlights);
    }

    toggleHighlightClass(shouldShowHighlights) {
      if (shouldShowHighlights) {
        this.element.addClass(SHOW_HIGHLIGHTS_CLASS);
      } else {
        this.element.removeClass(SHOW_HIGHLIGHTS_CLASS);
      }

      return this.visibleHighlights = shouldShowHighlights;
    }
  };
  Guest.initClass();
  return Guest;
})());
