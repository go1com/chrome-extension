import iocContainer from "../ioc/ioc.config";
import backgroundScriptContainer from "./ioc.background.config";

import {commandKeys} from "../environments/commandKeys";
import {
  ICommandHandlerService,
  ICommandHandlerServiceSymbol
} from "../services/commandHandlerService/ICommandHandlerService";

iocContainer.load(backgroundScriptContainer);

const commandHandlerService = iocContainer.get<ICommandHandlerService>(ICommandHandlerServiceSymbol);

const extensionVersion = '@EXTENSION_VERSION@';

chrome.contextMenus.create({
  "title": "Add Page to Portal",
  "contexts": ['page'],
  "onclick": (info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
      action: commandKeys.addToPortal
    }, (response) => {

    });
  }
});

chrome.contextMenus.create({
  "title": "Add Note",
  "contexts": ['page'],
  "onclick": (info, tab) => {
    chrome.tabs.sendMessage(tab.id, {
      action: commandKeys.startDiscussion
    }, (response) => {

    });
  }
});

chrome.contextMenus.create({
  "title": "Save to Note",
  "contexts": ['selection'],
  "onclick": (info, tab) => onSaveToNoteMenuContextClicked(info, tab)
});

function onSaveToNoteMenuContextClicked(info, tab) {
  chrome.tabs.sendMessage(tab.id, {
    action: commandKeys.startDiscussion
  }, (response) => {

  });
}

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {
    action: commandKeys.toggleExtensionPopup
  }, function (response) {

  });
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === 'getTabId') {
    sendResponse(sender);
    return true;
  }

  if (commandHandlerService.hasHandler(msg.action)) {
    commandHandlerService.handleCommand(msg.action, msg, sender, sendResponse);
    return true;
  }
  sendResponse({success: false, error: new Error('No command handler found for request action'), errorData: msg});
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.notifications.create(`go1-extension-install-notification-${new Date().getTime()}`, {
      iconUrl: '/assets/icon.png',
      type: 'basic',
      message: `Welcome to GO1 Extension ${extensionVersion}. 
      Please restart Google Chrome to make sure all the functionality works correctly in all opening tabs.`,
      title: `GO1 Extension Installed`
    });
  } else if (details.reason === 'update') {
    chrome.notifications.create(`go1-extension-update-notification-${new Date().getTime()}`, {
      iconUrl: '/assets/icon.png',
      type: 'basic',
      message: `GO1 Extension has been updated to version ${extensionVersion}. 
      Please restart Google Chrome to make sure all the functionality works correctly in all opening tabs.`,
      title: `GO1 Extension Updated`
    });
  }
});
