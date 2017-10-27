import iocContainer from "../ioc/ioc.config";
import contentScriptContainer from "./ioc.contentScript.config";

import {DocumentComponent} from "./components/injectionAreaComponent/documentComponent";
import {InjectionAreaComponent} from "./components/injectionAreaComponent/injectionAreaComponent";
import {
  ICommandHandlerService,
  ICommandHandlerServiceSymbol
} from "../services/commandHandlerService/ICommandHandlerService";

declare const $: any;
const ignoringDomains = ['mygo1.com', 'go1.com', 'www.google.com/maps'];

(async function () {
  const shouldIgnore = ignoringDomains.some((domain) => window.location.href.indexOf(domain) > -1);

  if (shouldIgnore) {
    return;
  }

  $('head').append('<link href="chrome-extension://' + chrome.runtime.id + '/styles/fontawesome.css" rel="stylesheet" />');

  iocContainer.load(contentScriptContainer);
  const commandHandlerService = iocContainer.get<ICommandHandlerService>(ICommandHandlerServiceSymbol);

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (commandHandlerService.hasHandler(msg.action)) {
      commandHandlerService.handleCommand(msg.action, msg, sender, sendResponse);
      return true;
    }

    sendResponse({success: false, error: new Error('No command handler found for request action'), errorData: msg});
  });

  const documentComponent = iocContainer.get<DocumentComponent>(DocumentComponent);
  const injectionArea = iocContainer.get<InjectionAreaComponent>(InjectionAreaComponent);

  await injectionArea.initialize(documentComponent);
})();
