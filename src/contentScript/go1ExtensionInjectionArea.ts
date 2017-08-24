import {ToolTipMenu} from "./toolTipsMenu";
import {commandKeys} from "../commandHandlers/commandKeys";

declare const $: any;

export class Go1ExtensionInjectionArea {
  static singleInstance: Go1ExtensionInjectionArea;

  containerArea: any;
  fabArea: any;
  createNoteEnabled: boolean;

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

  static toggleQuickButton() {
    Go1ExtensionInjectionArea.singleInstance.checkQuickButtonSettings();
  }

  static toggleCreateNote() {
    Go1ExtensionInjectionArea.singleInstance.checkCreateNoteSettings();
  }

  constructor() {
    this.createNoteEnabled = false;
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

  addListenerToSelectingText() {
    document.addEventListener('mouseup', event => this.onDocumentMouseUp(event));
  }

  removeListenerToSelectingText() {
    document.removeEventListener('mouseup', event => this.onDocumentMouseUp(event));
  }

  removeQuickButton() {
    this.fabArea.remove();
  }

  private onDocumentMouseUp(event: any) {
    if ($(event.target).closest('.go1-extension-injected').length) {
      return;
    }

    if (!this.createNoteEnabled)
      return;

    const selectedText = window.getSelection().toString();

    if (selectedText) {
      let selectedTextPosition = window.getSelection().getRangeAt(0).getBoundingClientRect();
      ToolTipMenu.initializeTooltip(selectedTextPosition, selectedText);

      // chrome.runtime.sendMessage({
      //   from: 'content',
      //   action: commandKeys.changeBrowserActionBadgeText,
      //   text: '+quote',
      //   title: 'GO1 Extension - Click to add new note'
      // });
    } else {
      // chrome.runtime.sendMessage({
      //   from: 'content',
      //   action: commandKeys.changeBrowserActionBadgeText
      // });
      ToolTipMenu.closeLastTooltip();
    }
  }
}
