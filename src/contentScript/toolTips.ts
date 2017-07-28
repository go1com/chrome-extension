import {NewDiscussionPopup} from "./discussionPopupModel";
import {Go1ExtensionInjectionArea} from "./go1ExtensionInjectionArea";

declare const $: any;

export class ToolTipMenu {
  selectingText: any;
  tooltipDOM: any;
  containerDOM: any;
  top: number;
  left: number;
  elementWidth: number;
  elementHeight: number;

  static toolTipMenus: any[] = [];

  static initializeTooltip(boundingRect, selectingText) {
    if (!Go1ExtensionInjectionArea.singleInstance)
      throw new Error('Go1 Extension is not initialized');

    ToolTipMenu.closeLastTooltip(true);

    const toolTip = new ToolTipMenu();
    ToolTipMenu.toolTipMenus.push(toolTip);

    toolTip.initialize(boundingRect, selectingText);
  }

  static closeLastTooltip(closeImmediately = false) {
    let currentTooltip = ToolTipMenu.toolTipMenus.pop();
    if (currentTooltip) {
      currentTooltip.dismiss(closeImmediately);
    }
  }


  initialize(boundingRect, selectingText) {
    this.top = boundingRect.top;
    this.left = boundingRect.left;
    this.elementWidth = boundingRect.width;
    this.elementHeight = boundingRect.height;
    this.selectingText = selectingText;

    const tooltipHtml = require('../views/selectionToolTipMenu.pug');

    this.tooltipDOM = $(tooltipHtml);

    Go1ExtensionInjectionArea.appendDOM(this.tooltipDOM);

    this.tooltipDOM.css({
      left: this.left + (this.elementWidth / 2) + 'px',
      top: this.top + window.scrollY - 32 + 'px'
    });

    this.tooltipDOM.addClass('fadeIn fadeInBottom');
    this.bindEventListeners();
  }

  dismiss(closeImmediately = false) {
    if (closeImmediately) {
      this.tooltipDOM.remove();
      return;
    }

    this.tooltipDOM.removeClass('fadeIn fadeInBottom');
    this.tooltipDOM.addClass('fadeOut fadeOutBottom');
    setTimeout(() => {
      this.tooltipDOM.remove();
    }, 1500);
  }

  private bindEventListeners() {
    $('a.create-note-cmd', this.tooltipDOM).on('click', async () => {
      await NewDiscussionPopup.openPopup(this.containerDOM, this.selectingText);
      this.dismiss();
    });
  }
}
