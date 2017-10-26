import * as _ from 'lodash';

import iocContainer from "../ioc/ioc.config";
import contentScriptContainer from "./ioc.contentScript.config";

import {Go1ExtensionInjectionArea} from "./go1ExtensionInjectionArea";
import {commandKeys} from "../environments/commandKeys";
import {
  IChromeCmdHandleService,
  IChromeCmdHandleServiceSymbol
} from "../services/chromeCommandHandlerService/IChromeCmdHandleService";

declare const $: any;
const ignoringDomains = ['mygo1.com', 'go1.com', 'www.google.com/maps'];

(function () {
  const shouldIgnore = _.some(ignoringDomains, (domain) => window.location.href.indexOf(domain) > -1);

  if (shouldIgnore) {
    return;
  }

  iocContainer.load(contentScriptContainer);
  const commandHandlerService = iocContainer.get<IChromeCmdHandleService>(IChromeCmdHandleServiceSymbol);

  $('head').append('<link href="chrome-extension://' + chrome.runtime.id + '/styles/fontawesome.css" rel="stylesheet" />');

  const injectionArea = iocContainer.get<Go1ExtensionInjectionArea>(Go1ExtensionInjectionArea);
  injectionArea.injectToDocument();

  // Go1ExtensionInjectionArea.initialize(iocContainer);

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (commandHandlerService.hasHandler(msg.name)) {
      commandHandlerService.handleCommand(msg.name, msg, sender, sendResponse);
      return true;
    }

    if (msg.name === commandKeys.checkQuickButtonSettings) {
      Go1ExtensionInjectionArea.toggleQuickButton();
      sendResponse({success: true});
      return true;
    }

    if (msg.name === commandKeys.checkHighlightNoteSettings) {
      Go1ExtensionInjectionArea.toggleHighlightArea();
      sendResponse({success: true});
      return true;
    }

    if (msg.name === commandKeys.checkCreateNoteSettings) {
      Go1ExtensionInjectionArea.toggleCreateNote();
      sendResponse({success: true});
      return true;
    }

    if (msg.name === commandKeys.getLinkPreview) {
      sendResponse({success: true, data: document.documentElement.innerHTML});
      return true;
    }

    sendResponse({success: false, error: new Error('No command handler found for request action'), errorData: msg});
  });
})();
