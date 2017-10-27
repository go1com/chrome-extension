import * as _ from 'lodash';

import iocContainer from "../ioc/ioc.config";
import contentScriptContainer from "./ioc.contentScript.config";

import {
  IChromeCmdHandleService,
  IChromeCmdHandleServiceSymbol
} from "../services/chromeCommandHandlerService/IChromeCmdHandleService";
import {DocumentComponent} from "./components/injectionAreaComponent/documentComponent";
import {InjectionAreaComponent} from "./components/injectionAreaComponent/injectionAreaComponent";

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

  const documentComponent = iocContainer.get<DocumentComponent>(DocumentComponent);
  const injectionArea = iocContainer.get<InjectionAreaComponent>(InjectionAreaComponent);

  injectionArea.initialize(documentComponent);

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (commandHandlerService.hasHandler(msg.action)) {
      commandHandlerService.handleCommand(msg.action, msg, sender, sendResponse);
      return true;
    }

    sendResponse({success: false, error: new Error('No command handler found for request action'), errorData: msg});
  });
})();
