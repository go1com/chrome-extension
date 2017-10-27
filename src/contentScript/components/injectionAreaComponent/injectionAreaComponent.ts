import {ToolTipMenu} from "../tooltipComponent/toolTipsMenu";
import {commandKeys} from "../../../environments/commandKeys";
import Util from '../../../libs/annotation-plugin/util';
import {HighlightService} from "../../services/highlightService";
import htmlUtil from '../../../plugins/annotation-plugin/html';
import {PopupContainer} from "../popupContainerComponent/popupContainer";
import {inject, injectable} from "inversify";
import {IContentScriptComponent} from "../IContentScriptComponent";
import {FabButtonsComponent} from "../fabButtonsComponent/fabButtonsComponent";
import {
  IBrowserMessagingService,
  IBrowserMessagingServiceSymbol
} from "../../../services/browserMessagingService/IBrowserMessagingService";

declare const $: any;

const hiddenClassName = 'highlighting-hidden';

@injectable()
export class InjectionAreaComponent implements IContentScriptComponent {
  public view: any;

  annotationIndicatorFrame: any;
  annotationIndicatorArea: any;
  createNoteEnabled: boolean;

  updateAnnotationTimeout: any;

  constructor(@inject(PopupContainer) private popupContainer: PopupContainer,
              @inject(FabButtonsComponent) private fabButtonComponent: FabButtonsComponent,
              @inject(IBrowserMessagingServiceSymbol) private chromeMessagingService: IBrowserMessagingService) {
    this.createNoteEnabled = false;

    this.view = $(require('./injectionArea.pug'));
  }

  async initialize(parentComponent: IContentScriptComponent) {
    this.view.appendTo($('body'));

    this.popupContainer.initialize(this);

    this.checkQuickButtonSettings(true);
    this.checkCreateNoteSettings(true);
    this.checkShowHighlightSettings(true);
  }

  async checkQuickButtonSettings(firstTimeInitial = false) {
    const quickButtonSetting = await this.chromeMessagingService.requestToBackground(commandKeys.checkQuickButtonSettings);

    if (!quickButtonSetting) {
      if (firstTimeInitial) {
        return;
      }
      this.removeQuickButton();
      return;
    }
    this.appendQuickButton();
  }

  async checkShowHighlightSettings(firstTimeInitial = false) {
    const highlightSettings = await this.chromeMessagingService.requestToBackground(commandKeys.checkHighlightNoteSettings);

    if (!highlightSettings) {
      if (firstTimeInitial) {
        return;
      }
      this.removeAnnotationIndicatorArea();
      return;
    }

    this.appendAnnotationIndicatorArea();
    this.checkNotesOnCurrentPage();
  }

  async checkCreateNoteSettings(firstTimeInitial = false) {
    const createNoteEnabled = await this.chromeMessagingService.requestToBackground(commandKeys.checkCreateNoteSettings);

    this.createNoteEnabled = createNoteEnabled;

    if (!createNoteEnabled) {
      if (firstTimeInitial) {
        return;
      }
      this.removeListenerToSelectingText();
      return;
    }
    this.addListenerToSelectingText();
  }

  appendQuickButton() {
    this.fabButtonComponent.initialize(this);
  }

  removeQuickButton() {
    this.fabButtonComponent.removeComponent();
  }

  appendAnnotationIndicatorArea() {
    this.annotationIndicatorFrame = $(require('../../views/annotationIndicatorBar.pug'));
    this.view.append(this.annotationIndicatorFrame);
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

      ToolTipMenu.initializeTooltip(this, selectedTextPosition, selectedText, xpathFromNode[0]);
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
