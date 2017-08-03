import {NewDiscussionPopup} from "./newDiscussionPopup";
import {ToolTipMenu} from "./toolTipsMenu";
import {AddToPortalPopup} from "./addToPortal/addToPortalPopup";
import {PopupBaseModel} from "./basePopup/popupBaseModel";
import {commandKeys} from "../commandHandlers/commandKeys";

declare const $: any;

export class Go1ExtensionInjectionArea {
  static singleInstance: Go1ExtensionInjectionArea;

  containerArea: any;
  fabArea: any;

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

  static toggleQuickButton() {
    Go1ExtensionInjectionArea.singleInstance.checkQuickButtonSettings();
  }

  constructor() {
    this.containerArea = $('<div class="go1-extension go1-extension-injected"></div>');
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

  injectToDocument() {
    $('body').append(this.containerArea);
    this.checkQuickButtonSettings(true);
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
      PopupBaseModel.openPopup(NewDiscussionPopup);
    });
    this.fabArea.find('.add-to-portal-btn').on('click', (event) => {
      thisComponent.fabArea.removeClass('active');
      PopupBaseModel.openPopup(AddToPortalPopup);
    });
  }

  removeQuickButton() {
    this.fabArea.remove();
  }
}
