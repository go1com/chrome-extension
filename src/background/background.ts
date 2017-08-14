import {ChromeCmdHandleService} from "../commandHandlers/ChromeCmdHandleService";
import {AddToPortalChromeCommandHandler} from "../commandHandlers/addToPortalChromeCommandHandler";
import {CheckQuickButtonSettingChromeCommandHandler} from "../commandHandlers/checkQuickButtonSettingChromeCommandHandler";
import {StartDiscussionChromeCommandHandler} from "../commandHandlers/startDiscussionChromeCommandHandler";
import {AddToPortalScheduleChromeCommandHandler} from "../commandHandlers/addToPortalScheduleChromeCommandHandler";
import {GetLinkPreviewChromeCommandHandler} from "../commandHandlers/getLinkPreviewChromeCommandHandler";
import {GetPortalsChromeCommandHandler} from "../commandHandlers/getPortalsChromeCommandHandler";

const commandHandlerService = new ChromeCmdHandleService();

commandHandlerService.registerHandler(new StartDiscussionChromeCommandHandler());
commandHandlerService.registerHandler(new AddToPortalChromeCommandHandler());
commandHandlerService.registerHandler(new CheckQuickButtonSettingChromeCommandHandler());
commandHandlerService.registerHandler(new AddToPortalScheduleChromeCommandHandler());
commandHandlerService.registerHandler(new GetLinkPreviewChromeCommandHandler());
commandHandlerService.registerHandler(new GetPortalsChromeCommandHandler());

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (commandHandlerService.hasHandler(msg.action)) {
    commandHandlerService.handleCommand(msg.action, msg, sender, sendResponse);
    return true;
  }
  sendResponse({success: false, error: new Error('No command handler found for request action'), errorData: msg});
});
