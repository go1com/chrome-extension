import {ChromeCmdHandleService} from "../commandHandlers/ChromeCmdHandleService";
import {AddToPortalChromeCommandHandler} from "../commandHandlers/addToPortalChromeCommandHandler";
import {CheckQuickButtonSettingChromeCommandHandler} from "../commandHandlers/checkQuickButtonSettingChromeCommandHandler";
import {StartDiscussionChromeCommandHandler} from "../commandHandlers/startDiscussionChromeCommandHandler";
import {AddToPortalScheduleChromeCommandHandler} from "../commandHandlers/addToPortalScheduleChromeCommandHandler";
import {GetLinkPreviewChromeCommandHandler} from "../commandHandlers/getLinkPreviewChromeCommandHandler";
import {GetPortalsChromeCommandHandler} from "../commandHandlers/getPortalsChromeCommandHandler";
import {ChangeIconBadgeChromeCommandHandler} from "../commandHandlers/changeIconBadgeChromeCommandHandler";
import {CheckCreateNoteMenuSettingChromeCommandHandler} from "../commandHandlers/checkCreateNoteMenuSettingChromeCommandHandler";
import {OnUserLoggedInChromeCommandHandler} from "../commandHandlers/onUserLoggedInChromeCommandHandler";
import {ClearBadgeNotificationChromeCommandHandler} from "../commandHandlers/clearBadgeNotificationChromeCommandHandler";
import {GetNotificationMessagesChromeCommandHandler} from "../commandHandlers/getNotificationMessagesChromeCommandHandler";
import {CountNotificationChromeCommandHandler} from "../commandHandlers/countNotificationChromeCommandHandler";
import {commandKeys} from "../commandHandlers/commandKeys";
import {LoadNotesForPageChromeCommandHandler} from "../commandHandlers/LoadNotesForPageChromeCommandHandler";
import {CheckHighlightSettingChromeCommandHandler} from "../commandHandlers/checkHighlightSettingChromeCommandHandler";

const commandHandlerService = new ChromeCmdHandleService();
const extensionVersion = '@EXTENSION_VERSION@';
const onUserLoggedInChromeCommandHandler = new OnUserLoggedInChromeCommandHandler();

commandHandlerService.registerHandler(new StartDiscussionChromeCommandHandler());
commandHandlerService.registerHandler(new AddToPortalChromeCommandHandler());

commandHandlerService.registerHandler(new CheckQuickButtonSettingChromeCommandHandler());
commandHandlerService.registerHandler(new CheckHighlightSettingChromeCommandHandler());
commandHandlerService.registerHandler(new CheckCreateNoteMenuSettingChromeCommandHandler());

commandHandlerService.registerHandler(new AddToPortalScheduleChromeCommandHandler());
commandHandlerService.registerHandler(new GetLinkPreviewChromeCommandHandler());
commandHandlerService.registerHandler(new GetPortalsChromeCommandHandler());
commandHandlerService.registerHandler(new ChangeIconBadgeChromeCommandHandler());
commandHandlerService.registerHandler(new ClearBadgeNotificationChromeCommandHandler());
commandHandlerService.registerHandler(new CountNotificationChromeCommandHandler());
commandHandlerService.registerHandler(new GetNotificationMessagesChromeCommandHandler());
commandHandlerService.registerHandler(new LoadNotesForPageChromeCommandHandler());


commandHandlerService.registerHandler(onUserLoggedInChromeCommandHandler);

onUserLoggedInChromeCommandHandler.initialize();

chrome.runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(function () {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          name: commandKeys.removeAllHighlight
        }, function (response) {

        });
      });
    });
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
