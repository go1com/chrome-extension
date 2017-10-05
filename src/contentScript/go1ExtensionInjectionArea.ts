import {ToolTipMenu} from "./toolTipsMenu";
import {commandKeys} from "../commandHandlers/commandKeys";
import Util from '../libs/annotation-plugin/util';
import {HighlightService} from "./services/highlightService";
import {checkNoChangesNode} from "@angular/core/src/view/view";

declare const $: any;

const hiddenClassName = 'highlighting-hidden';

export class Go1ExtensionInjectionArea {
  static singleInstance: Go1ExtensionInjectionArea;

  containerArea: any;
  fabArea: any;
  annotationIndicatorFrame: any;
  annotationIndicatorArea: any;
  createNoteEnabled: boolean;

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
    this.containerArea = $(`<div class="go1-extension go1-extension-injected"></div>`);
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
    this.checkQuickButtonSettings(true);
    this.checkCreateNoteSettings(true);
    this.checkShowHighlightSettings(true);
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
      });
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

  checkNotesOnCurrentPage() {
    $('.annotation-indicator').remove();
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
