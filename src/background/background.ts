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

const commandHandlerService = new ChromeCmdHandleService();
const extensionVersion = '@EXTENSION_VERSION@';
const onUserLoggedInChromeCommandHandler = new OnUserLoggedInChromeCommandHandler();

commandHandlerService.registerHandler(new StartDiscussionChromeCommandHandler());
commandHandlerService.registerHandler(new AddToPortalChromeCommandHandler());
commandHandlerService.registerHandler(new CheckQuickButtonSettingChromeCommandHandler());
commandHandlerService.registerHandler(new AddToPortalScheduleChromeCommandHandler());
commandHandlerService.registerHandler(new GetLinkPreviewChromeCommandHandler());
commandHandlerService.registerHandler(new GetPortalsChromeCommandHandler());
commandHandlerService.registerHandler(new ChangeIconBadgeChromeCommandHandler());
commandHandlerService.registerHandler(new CheckCreateNoteMenuSettingChromeCommandHandler());
commandHandlerService.registerHandler(new ClearBadgeNotificationChromeCommandHandler());
commandHandlerService.registerHandler(new CountNotificationChromeCommandHandler());
commandHandlerService.registerHandler(new GetNotificationMessagesChromeCommandHandler());


commandHandlerService.registerHandler(onUserLoggedInChromeCommandHandler);

onUserLoggedInChromeCommandHandler.initialize();

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (commandHandlerService.hasHandler(msg.action)) {
    commandHandlerService.handleCommand(msg.action, msg, sender, sendResponse);
    return true;
  }
  sendResponse({success: false, error: new Error('No command handler found for request action'), errorData: msg});
});


chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    chrome.notifications.create(`go1-extension-update-notification-${new Date().getTime()}`, {
      iconUrl: '/assets/icon.png',
      type: 'basic',
      message: `The extension has been updated to version ${extensionVersion}`,
      title: `GO1 Extension Updated`
    });
  }
});
