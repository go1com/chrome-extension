import {NewDiscussionPopup} from "./discussionPopupModel";
import {ToolTipMenu} from "./toolTips";

declare const $: any;

export class Go1ExtensionInjectionArea {
  static singleInstance: Go1ExtensionInjectionArea;

  containerArea: any;
  go1QuickButton: any;

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

      document.addEventListener('mouseup', (event) => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
          let selectedTextPosition = window.getSelection().getRangeAt(0).getBoundingClientRect();

          ToolTipMenu.initializeTooltip(selectedTextPosition, selectedText);
        } else {
          ToolTipMenu.closeLastTooltip();
        }
      });
    }

    return Go1ExtensionInjectionArea.singleInstance;
  }

  constructor() {
    this.containerArea = $('<div class="go1-extension go1-extension-injected"></div>');
    this.go1QuickButton = $('<button class="go1-add-to-portal-button"></button>');
  }

  injectToDocument() {
    $('body').append(this.containerArea);

    chrome.runtime.sendMessage({
      from: 'content',
      action: 'checkQuickButtonSetting'
    }, (quickButtonSetting) => {
      if (!quickButtonSetting) {
        return;
      }
      this.appendQuickButton();
    });
  }

  appendQuickButton() {
    this.containerArea.append(this.go1QuickButton);

    this.go1QuickButton.on('click', (event) => NewDiscussionPopup.openPopup(Go1ExtensionInjectionArea.singleInstance));
  }

  removeQuickButton() {
    this.go1QuickButton.remove();
  }
}
