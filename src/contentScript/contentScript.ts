import {NewDiscussionPopup} from "./discussionPopupModel";
import {ToolTipMenu} from "./toolTips";

const chromeExtId = chrome.runtime.id;

const go1ExtensionContainer = document.createElement('div');
go1ExtensionContainer.classList.add('go1-extension');
go1ExtensionContainer.classList.add('go1-extension-injected');
document.body.appendChild(go1ExtensionContainer);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.quickButtonSettingChanged) {
    if (request.quickButtonSettingChanged.newValue) {
      appendQuickButton();
    } else {
      removeQuickButton();
    }
  }
});

document.addEventListener('mouseup', (event) => {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    console.log('selected text: ' + selectedText);
    let selectedTextPosition = window.getSelection().getRangeAt(0).getBoundingClientRect();
    console.log(selectedTextPosition);

    ToolTipMenu.initializeTooltip(go1ExtensionContainer, selectedTextPosition, selectedText);
  } else {
    ToolTipMenu.closeLastTooltip();
  }
});

chrome.runtime.sendMessage({
  from: 'content',
  action: 'checkQuickButtonSetting'
}, (quickButtonSetting) => {
  if (!quickButtonSetting) {
    return;
  }
  appendQuickButton();
});

function appendQuickButton() {
  const go1Button = document.createElement('button');
  go1Button.classList.add('go1-add-to-portal-button');
  go1ExtensionContainer.appendChild(go1Button);

  go1Button.addEventListener('click', (event) => NewDiscussionPopup.openPopup(go1ExtensionContainer));
}

function removeQuickButton() {
  const go1QuickButton = go1ExtensionContainer.querySelector('button.go1-add-to-portal-button');
  if (go1QuickButton) {
    go1ExtensionContainer.removeChild(go1QuickButton);
  }
}
