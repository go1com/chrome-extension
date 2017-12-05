import iocContainer from "../ioc/ioc.config";
import backgroundScriptContainer from "./ioc.background.config";

import { commandKeys } from "../environments/commandKeys";
import {
  ICommandHandlerService,
  ICommandHandlerServiceSymbol
} from "../services/commandHandlerService/ICommandHandlerService";
import { IStorageService, IStorageServiceSymbol } from "../services/storageService/IStorageService";
import configuration from "../environments/configuration";
import { SharedPortalService } from "../services/portalService/PortalService";
import {
  IBrowserMessagingService,
  IBrowserMessagingServiceSymbol
} from "../services/browserMessagingService/IBrowserMessagingService";

iocContainer.load(backgroundScriptContainer);

const commandHandlerService = iocContainer.get<ICommandHandlerService>(ICommandHandlerServiceSymbol);
const browserMessagingService = iocContainer.get<IBrowserMessagingService>(IBrowserMessagingServiceSymbol);

const extensionVersion = '@EXTENSION_VERSION@';

const menuIds = {
  AddToPortal: 'add-to-portal-menu',
  AddNote: 'add-note-menu',
  SaveQuotationToNote: 'save-quotation-to-note'
};

chrome.contextMenus.create({
                             id: menuIds.AddToPortal,
                             title: "Add Page to Portal",
                             contexts: ['page'],
                             onclick: (info, tab) => browserMessagingService.requestToTab(tab.id, commandKeys.addToPortal)
                           });

chrome.contextMenus.create({
                             id: menuIds.AddNote,
                             "title": "Add Note",
                             "contexts": ['page'],
                             "onclick": (info, tab) => browserMessagingService.requestToTab(tab.id, commandKeys.startDiscussion)
                           });

chrome.contextMenus.create({
                             id: menuIds.SaveQuotationToNote,
                             "title": "Save to Note",
                             "contexts": ['selection'],
                             "onclick": (info, tab) => browserMessagingService.requestToTab(tab.id, commandKeys.startDiscussion)
                           });

chrome.webNavigation.onCompleted.addListener(async function (details) {
  console.log(details);

  const ignoringDomains = ['mygo1.com', 'go1.com', 'www.google.com/maps'];
  const storageService = iocContainer.get<IStorageService>(IStorageServiceSymbol);

  let configuredIgnoredDomains = await storageService.retrieve(configuration.constants.localStorageKeys.ignoredDomains) || [];

  configuredIgnoredDomains = configuredIgnoredDomains.concat(ignoringDomains);

  const shouldIgnore = configuredIgnoredDomains.some((domain) => details.url.indexOf(domain) > -1);

  if (shouldIgnore) {
    chrome.browserAction.disable(details.tabId);

    chrome.contextMenus.update(menuIds.AddNote, {
      enabled: false
    });
    chrome.contextMenus.update(menuIds.AddToPortal, {
      enabled: false
    });
    chrome.contextMenus.update(menuIds.SaveQuotationToNote, {
      enabled: false
    });
    return;
  }

  const portalService = iocContainer.get<SharedPortalService>(SharedPortalService);
  const portal = await portalService.getDefaultPortalInfo();
  const user = await storageService.retrieve(configuration.constants.localStorageKeys.user);

  if (!portalService.canAddToPortal(portal, user)) {
    chrome.contextMenus.update('add-to-portal-menu', {
      enabled: false
    });
  }
});


chrome.browserAction.onClicked.addListener(async (tab) => browserMessagingService.requestToTab(tab.id, commandKeys.toggleExtensionPopup));

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === 'getTabId') {
    sendResponse(sender);
    return true;
  }

  if (commandHandlerService.hasHandler(msg.action)) {
    commandHandlerService.handleCommand(msg.action, msg, sender, sendResponse);
    return true;
  }
  sendResponse({ success: false, error: new Error('No command handler found for request action'), errorData: msg });
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
