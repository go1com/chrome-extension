import {NewDiscussionPopup} from "./discussionPopupModel";


export class ToolTipMenu {
  selectingText: any;
  tooltipDOM: any;
  containerDOM: any;
  top: number;
  left: number;
  elementWidth: number;
  elementHeight: number;

  static toolTipMenus: any[] = [];

  static initializeTooltip(parentNode, boundingRect, selectingText) {
    ToolTipMenu.closeLastTooltip(true);

    const toolTip = new ToolTipMenu(parentNode);
    ToolTipMenu.toolTipMenus.push(toolTip);

    toolTip.initialize(boundingRect, selectingText);
  }

  static closeLastTooltip(closeImmediately = false) {
    let currentTooltip = ToolTipMenu.toolTipMenus.pop();
    if (currentTooltip) {
      currentTooltip.dismiss(closeImmediately);
    }
  }

  constructor(parentNode) {
    this.containerDOM = parentNode;
  }

  initialize(boundingRect, selectingText) {
    this.top = boundingRect.top;
    this.left = boundingRect.left;
    this.elementWidth = boundingRect.width;
    this.elementHeight = boundingRect.height;
    this.selectingText = selectingText;

    const tooltipHtml = require('../views/selectionToolTipMenu.pug');

    this.containerDOM.insertAdjacentHTML('beforeend', tooltipHtml);
    this.tooltipDOM = this.containerDOM.querySelector('.go1-tooltip');

    this.tooltipDOM.style.left = this.left + (this.elementWidth / 2) + 'px';
    this.tooltipDOM.style.top = this.top + window.scrollY - 32 + 'px';

    this.tooltipDOM.classList.add('fadeIn');
    this.tooltipDOM.classList.add('fadeInBottom');
    this.bindEventListeners();
  }

  dismiss(closeImmediately = false) {
    if (closeImmediately) {
      this.containerDOM.removeChild(this.tooltipDOM);
    }

    this.tooltipDOM.classList.remove('fadeIn');
    this.tooltipDOM.classList.remove('fadeInBottom');
    this.tooltipDOM.classList.add('fadeOut');
    this.tooltipDOM.classList.add('fadeOutBottom');
    setTimeout(() => {
      this.containerDOM.removeChild(this.tooltipDOM);
    }, 1500);
  }

  private bindEventListeners() {
    this.tooltipDOM.querySelector('a.create-note-cmd').addEventListener('click', async () => {
      await NewDiscussionPopup.openPopup(this.containerDOM, this.selectingText);
      this.dismiss();
    });
  }
}
