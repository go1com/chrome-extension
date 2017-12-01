import { ToolTipMenuComponent } from "../tooltipComponent/toolTipsMenu";
import { commandKeys } from "../../../environments/commandKeys";
import Util from '../../../libs/annotation-plugin/util';
import { highlightClassName, HighlightService } from "../../services/highlightService";
import htmlUtil from '../../../plugins/annotation-plugin/html';
import { PopupContainer } from "../popupContainerComponent/popupContainer";
import { inject, injectable } from "inversify";
import { IContentScriptComponent } from "../IContentScriptComponent";
import { FabButtonsComponent } from "../fabButtonsComponent/fabButtonsComponent";
import {
  IBrowserMessagingService,
  IBrowserMessagingServiceSymbol
} from "../../../services/browserMessagingService/IBrowserMessagingService";
import { TextSelector } from "../../../libs/annotator/textselector";
import { Highlighter } from "../../../libs/annotator/highlighter";

declare const $: any;

const hiddenClassName = 'highlighting-hidden';


// trim strips whitespace from either end of a string.
//
// This usually exists in native code, but not in IE8.
function trim(s) {
  if (typeof String.prototype.trim === 'function') {
    return String.prototype.trim.call(s);
  } else {
    return s.replace(/^[\s\xA0]+|[\s\xA0]+$/g, '');
  }
}

// annotationFactory returns a function that can be used to construct an
// annotation from a list of selected ranges.
function annotationFactory(contextEl, ignoreSelector) {
  return function (ranges) {
    const text = [],
      serializedRanges = [];

    for (let i = 0, len = ranges.length; i < len; i++) {
      const r = ranges[i];
      text.push(trim(r.text()));
      serializedRanges.push(r.serialize(contextEl, ignoreSelector));
    }

    return {
      quote: text.join(' / '),
      ranges: serializedRanges
    };
  };
}

const makeAnnotation = annotationFactory(document.body, '.annotator-hl');

@injectable()
export class InjectionAreaComponent implements IContentScriptComponent {
  currentAnnotation: any = null;
  highlighter: Highlighter;
  public view: any;

  annotationIndicatorFrame: any;
  annotationIndicatorArea: any;
  createNoteEnabled: boolean;

  updateAnnotationTimeout: any;
  textSelector: TextSelector;

  constructor(@inject(PopupContainer) private popupContainer: PopupContainer,
              @inject(FabButtonsComponent) private fabButtonComponent: FabButtonsComponent,
              @inject(HighlightService) private highlightService: HighlightService,
              @inject(IBrowserMessagingServiceSymbol) private chromeMessagingService: IBrowserMessagingService) {
    this.createNoteEnabled = false;

    this.view = $(require('./injectionArea.pug'));
  }

  async initialize(parentComponent: IContentScriptComponent) {
    this.view.appendTo($('body'));

    this.popupContainer.initialize(this);

    this.highlighter = new Highlighter(document.body, {
      highlightingClass: highlightClassName
    });

    this.textSelector = new TextSelector(document.body, {
      highlightingClass: highlightClassName,
      onSelection: (ranges, event) => this.onTextSelected(ranges, event)
    });

    await Promise.all([
                        this.checkQuickButtonSettings(true),
                        this.checkCreateNoteSettings(),
                        this.checkShowHighlightSettings(true)
                      ]);
  }

  onTextSelected(ranges, event) {
    if (ranges.length > 0) {
      const selection = window.getSelection();
      const selectedTextPosition = selection.getRangeAt(0).getBoundingClientRect();
      const annotation = JSON.stringify(makeAnnotation(ranges));

      this.currentAnnotation = JSON.parse(annotation);

      if (this.createNoteEnabled) {
        ToolTipMenuComponent.initializeTooltip(this, selectedTextPosition, JSON.parse(annotation));
      }
    } else {
      if (this.createNoteEnabled) {
        ToolTipMenuComponent.closeLastTooltip();
      }
    }
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

  async checkCreateNoteSettings() {
    this.createNoteEnabled = await this.chromeMessagingService.requestToBackground(commandKeys.checkCreateNoteSettings);
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
    this.highlightService.unhighlight();
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

        this.highlightService.highlight(note.context.quotation, note.context.quotationPosition, hiddenClassName)
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

    annotationIndicator.css('top', domOffset.top)
                       .attr('title', quotationText)
                       .data('connectedDOM', $(dom))
                       .appendTo(this.annotationIndicatorArea);

    this.updateAnnotationTimeout = setTimeout(() => this.updateAnnotationAreaPosition(), 300);

    if (this.annotationIndicatorArea.hasClass('no-indicator')) {
      this.annotationIndicatorArea.removeClass('no-indicator');
    }

    annotationIndicator.on('click', function (event) {
      event.stopPropagation();
      const connectedDOM = $(this).data('connectedDOM');

      const scrollTo = $(connectedDOM);

      $('html, body').animate({
                                scrollTop: scrollTo.offset().top - 75,
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
