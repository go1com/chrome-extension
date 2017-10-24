import {ToolTipMenu} from "./toolTipsMenu";
import {commandKeys} from "../commandHandlers/commandKeys";
import Util from '../libs/annotation-plugin/util';
import {HighlightService} from "./services/highlightService";
import htmlUtil from '../plugins/annotation-plugin/html';
import Range from '../plugins/annotation-plugin/range';
import * as _ from 'lodash';

declare const $: any;

const hiddenClassName = 'highlighting-hidden';

export class Go1ExtensionInjectionArea {
  popupUrl: string;
  go1PopupContainer: any;
  static singleInstance: Go1ExtensionInjectionArea;

  containerArea: any;
  togglePopupButton: any;
  fabArea: any;
  annotationIndicatorFrame: any;
  annotationIndicatorArea: any;
  createNoteEnabled: boolean;
  popupClosed: boolean = true;

  updateAnnotationTimeout: any;

  static appendDOM(dom) {
    if (!Go1ExtensionInjectionArea.singleInstance) {
      Go1ExtensionInjectionArea.initialize();
    }

    Go1ExtensionInjectionArea.singleInstance.containerArea.append(dom);
  }

  static initialize() {
    if (!Go1ExtensionInjectionArea.singleInstance) {
      Go1ExtensionInjectionArea.singleInstance = new Go1ExtensionInjectionArea();
      Go1ExtensionInjectionArea.singleInstance.injectToDocument();
    }

    return Go1ExtensionInjectionArea.singleInstance;
  }

  static toggleHighlightArea() {
    Go1ExtensionInjectionArea.singleInstance.checkShowHighlightSettings();
  }

  static toggleQuickButton() {
    Go1ExtensionInjectionArea.singleInstance.checkQuickButtonSettings();
  }

  static toggleCreateNote() {
    Go1ExtensionInjectionArea.singleInstance.checkCreateNoteSettings();
  }

  constructor() {
    this.createNoteEnabled = false;
    this.popupUrl = `chrome-extension://${chrome.runtime.id}/index.html`;
    this.containerArea = $(`
<div class="go1-extension go1-extension-injected">
  <div id="go1-popup-frame-container" class="go1-popup-frame-container animated fast slideOutRight">
    <button id="go1-popup-close-btn"><i class="fa fa-chevron-left"></i></button>
    <iframe id="popup-iframe" src="${this.popupUrl}"></iframe>
  </div>
</div>`);
    this.fabArea = $(require('./views/fabButtons.pug'));
  }

  checkQuickButtonSettings(firstTimeInitial = false) {
    chrome.runtime.sendMessage({
      from: 'content',
      action: commandKeys.checkQuickButtonSettings
    }, (quickButtonSetting) => {
      if (!quickButtonSetting) {
        if (firstTimeInitial) {
          return;
        }
        this.removeQuickButton();
        return;
      }
      this.appendQuickButton();
    });
  }

  checkShowHighlightSettings(firstTimeInitial = false) {
    chrome.runtime.sendMessage({
      from: 'content',
      action: commandKeys.checkHighlightNoteSettings
    }, (highlightSettings) => {
      if (!highlightSettings) {
        if (firstTimeInitial) {
          return;
        }
        this.removeAnnotationIndicatorArea();
        return;
      }

      this.appendAnnotationIndicatorArea();
      this.checkNotesOnCurrentPage();
    });
  }

  checkCreateNoteSettings(firstTimeInitial = false) {
    chrome.runtime.sendMessage({
      from: 'content',
      action: commandKeys.checkCreateNoteSettings
    }, (createNoteEnabled) => {
      this.createNoteEnabled = createNoteEnabled;

      if (!createNoteEnabled) {
        if (firstTimeInitial) {
          return;
        }
        this.removeListenerToSelectingText();
        return;
      }
      this.addListenerToSelectingText();
    });
  }

  injectToDocument() {
    $('body').append(this.containerArea);

    this.containerArea.find('button#go1-popup-close-btn').on('click', () => this.togglePopup());

    this.go1PopupContainer = this.containerArea.find('#go1-popup-frame-container');
    this.togglePopupButton = this.containerArea.find('button#go1-popup-close-btn');

    ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend'].forEach(event => {
      this.go1PopupContainer.on(event, _.debounce((e) => this.onPopupAnimationEnded(e), 200));
    });

    this.checkQuickButtonSettings(true);
    this.checkCreateNoteSettings(true);
    this.checkShowHighlightSettings(true);

    const popupContent = this.go1PopupContainer.find('iframe#popup-iframe');

    popupContent.on('load', () => {
      this.go1PopupContainer.addClass('finished-loading');
      popupContent.off('load');
    });
  }

  togglePopup() {
    if (this.popupClosed) {
      this.showPopup();
    } else {
      this.closePopup();
    }
  }

  closePopup() {
    this.go1PopupContainer.removeClass('slideInRight').addClass('slideOutRight');
    this.popupClosed = true;
    this.togglePopupButton.html(`<i class="fa fa-chevron-left"></i>`);
  }

  showPopup(popupPage?) {
    const popupContainer = this.containerArea.find('.go1-popup-frame-container');
    const popupContent = popupContainer.find('iframe#popup-iframe');

    if (popupPage) {
      const url = `${this.popupUrl}#/${popupPage || ''}`;
      if (popupContent.attr('src') === url) {
        popupContent.attr('src', `${this.popupUrl}#/`);
        setTimeout(() => popupContent.attr('src', url), 100);
      } else {
        popupContent.attr('src', url);
      }
    }
    popupContainer.addClass('slideInRight fast').removeClass('hidden slideOutRight');
    this.popupClosed = false;
    this.togglePopupButton.html(`<i class="fa fa-chevron-right"></i>`);
  }

  onPopupAnimationEnded(e) {
    console.log('go1 popup animation finished', e);
  }

  appendQuickButton() {
    this.containerArea.append(this.fabArea);
    const thisComponent = this;
    $(thisComponent.fabArea).mouseleave(function (event) {
      setTimeout(() => {
        thisComponent.fabArea.removeClass('active');
      }, 3000);
    });

    this.fabArea.find('.trigger-fab').on('click', (event) => {
      thisComponent.fabArea.addClass('active');
    });

    this.fabArea.find('.start-discussion-btn').on('click', (event) => {
      thisComponent.fabArea.removeClass('active');

      chrome.runtime.sendMessage({
        from: 'content',
        action: commandKeys.startDiscussion
      }, response => this.showPopup('discussionsList/newDiscussion'));
    });

    this.fabArea.find('.add-to-portal-btn').on('click', (event) => {
      thisComponent.fabArea.removeClass('active');

      chrome.runtime.sendMessage({
        from: 'content',
        action: commandKeys.addToPortal
      });
    });
  }

  appendAnnotationIndicatorArea() {
    this.annotationIndicatorFrame = $(require('./views/annotationIndicatorBar.pug'));
    this.containerArea.append(this.annotationIndicatorFrame);
    this.annotationIndicatorArea = $('.annotation-indicator-bar', this.annotationIndicatorFrame);

    $(window).on('scroll', () => this.updateAnnotationAreaPosition());

    this.updateAnnotationAreaPosition();
  }

  updateAnnotationAreaPosition() {
    const windowScrollTop = $(window).scrollTop();
    this.annotationIndicatorArea.css('top', -(windowScrollTop));

    let beyondTopAnchors = 0;
    let beyondBottomAnchors = 0;
    $('.annotation-indicator', this.annotationIndicatorArea).each(function () {
      const annotationIndicator = $(this);

      if (windowScrollTop > annotationIndicator.offset().top) {
        beyondTopAnchors++;
      } else if (windowScrollTop + window.innerHeight < annotationIndicator.offset().top) {
        beyondBottomAnchors++;
      }
    });

    if (!beyondTopAnchors) {
      $('.annotation-indicator-up', this.annotationIndicatorArea).addClass('hidden');
    } else {
      $('.annotation-indicator-up', this.annotationIndicatorArea).removeClass('hidden');
      $('.annotation-indicator-up .label', this.annotationIndicatorArea).text(beyondTopAnchors);
    }

    if (!beyondBottomAnchors) {
      $('.annotation-indicator-down', this.annotationIndicatorArea).addClass('hidden');
    } else {
      $('.annotation-indicator-down', this.annotationIndicatorArea).removeClass('hidden');
      $('.annotation-indicator-down .label', this.annotationIndicatorArea).text(beyondBottomAnchors);
    }
  }

  addListenerToSelectingText() {
    document.addEventListener('click', event => this.onDocumentMouseDown(event));
    document.addEventListener('mouseup', event => this.onDocumentMouseUp(event));
  }

  removeListenerToSelectingText() {
    document.removeEventListener('click', event => this.onDocumentMouseDown(event));
    document.removeEventListener('mouseup', event => this.onDocumentMouseUp(event));
  }

  removeQuickButton() {
    this.fabArea.remove();
  }

  removeAnnotationIndicatorArea() {
    if (this.annotationIndicatorFrame) {
      this.annotationIndicatorFrame.remove();
      this.annotationIndicatorFrame = null;
    }
  }

  private onDocumentMouseDown(event: any) {
    if ($(event.target).is('.annotation-indicator') || $(event.target).closest('.annotation-indicator').length) {
      return;
    }
    HighlightService.unhighlight();
  }

  private onDocumentMouseUp(event: any) {
    if ($(event.target).closest('.go1-extension-injected').length) {
      this.checkNotesOnCurrentPage();
      return;
    }

    if (!this.createNoteEnabled) {
      this.checkNotesOnCurrentPage();
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection && selection.toString();

    if (selectedText) {
      const selectedTextPosition = selection.getRangeAt(0).getBoundingClientRect();
      const xpathFromNode = Util.xpathFromNode($(selection.anchorNode.parentNode));

      ToolTipMenu.initializeTooltip(selectedTextPosition, selectedText, xpathFromNode[0]);
    } else {
      ToolTipMenu.closeLastTooltip();
    }
    this.checkNotesOnCurrentPage();
  }

  createAnnotation() {
    const root = $('body');

    const _range = this.selectedRange(document);

    const options = {
      ignoreSelector: '[class^="annotator-"]'
    };

    const getSelectors = function (range) {
      // Returns an array of selectors for the passed range.
      return htmlUtil.describe(root, range, options);
    };

    const annotation: any = {};

    const locate = function (target) {
      return htmlUtil.anchor(root, target.selector, options)
        .then(range => {
          return {target, range};
        })
        .catch(() => {
          return {target};
        });
    };

    const highlight = function (anchor) {
      // Highlight the range for an anchor.
      if (anchor.range == null) {
        return anchor;
      }

      const range = Range.sniff(anchor.range);
      const normedRange = range.normalize(root);
      console.log(normedRange);

      // const highlights = highlighter.highlightRange(normedRange);

      // $(highlights).data('annotation', anchor.annotation);
      // anchor.highlights = highlights;
      return anchor;
    };

    const setTargets = function (...args) {
      // `selectors` is an array of arrays: each item is an array of selectors
      // identifying a distinct target.
      let selectors;
      [selectors] = Array.from(args[0]);
      return annotation.target = (Array.from(selectors).map((selector) => ({selector})));
    };

    const selectors = Promise.all([_range].map(getSelectors));
    const targets = Promise.all([selectors]).then(setTargets);
    targets.then(() => {
      if (annotation.target == null) {
        annotation.target = [];
      }

      console.log(annotation.target);

      for (let target of annotation.target) {
        const anchor = locate(target).then((whatever => {
          highlight(whatever);
        }));
      }
    });
  }

  selectedRange(document) {
    const selection = document.getSelection();
    if (!selection.rangeCount || selection.getRangeAt(0).collapsed) {
      return null;
    } else {
      return selection.getRangeAt(0);
    }
  }

  checkNotesOnCurrentPage() {
    $('.annotation-indicator').remove();
    if (!this.annotationIndicatorArea) {
      return;
    }

    chrome.runtime.sendMessage({
      action: commandKeys.loadNotesForPage,
      contextUrl: window.location.href
    }, (response) => {
      if (!response.data || !response.data.length) {
        this.annotationIndicatorArea.addClass('no-indicator');
        return;
      }

      chrome.runtime.sendMessage({
        action: commandKeys.changeBrowserActionBadgeText,
        text: response.data.length.toString(),
        title: `${response.data.length} note${response.data.length > 1 ? 's' : ''} available in this page`
      });

      response.data.forEach(note => {
        if (!note.context.quotation || !note.context.quotationPosition) {
          return;
        }

        HighlightService.highlight(note.context.quotation, note.context.quotationPosition, hiddenClassName)
          .then(dom => {
            this.generateAnnotationIndicator(dom, note.context.quotation);
          });
      });
    });
  }

  private generateAnnotationIndicator(dom: any, quotationText) {
    if (this.updateAnnotationTimeout) {
      clearTimeout(this.updateAnnotationTimeout);
    }

    const annotationIndicatorHTML = `<div class="annotation-indicator"></div>`;
    const annotationIndicator = $(annotationIndicatorHTML);

    const domOffset = $(dom).offset();
    console.log(domOffset);

    annotationIndicator.css('top', domOffset.top);
    annotationIndicator.attr('title', quotationText);
    annotationIndicator.data('connectedDOM', $(dom));
    annotationIndicator.appendTo(this.annotationIndicatorArea);

    this.updateAnnotationTimeout = setTimeout(() => this.updateAnnotationAreaPosition(), 300);

    if (this.annotationIndicatorArea.hasClass('no-indicator')) {
      this.annotationIndicatorArea.removeClass('no-indicator');
    }

    annotationIndicator.on('click', function (event) {
      event.stopPropagation();
      const connectedDOM = $(this).data('connectedDOM');

      const scrollTo = $(connectedDOM);

      $('html, body').animate({
        scrollTop: scrollTo.offset().top - 75
      });​
    });

    annotationIndicator.on('mouseover', function () {
      const connectedDOM = $(this).data('connectedDOM');

      connectedDOM.removeClass(hiddenClassName);
    });

    annotationIndicator.on('mouseout', function () {
      const connectedDOM = $(this).data('connectedDOM');

      connectedDOM.addClass(hiddenClassName);
    });
  }
}
