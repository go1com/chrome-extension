import {Go1ExtensionInjectionArea} from "./go1ExtensionInjectionArea";
import {commandKeys} from "../commandHandlers/commandKeys";
import * as _ from 'lodash';

const chromeExtId = chrome.runtime.id;
declare const $: any;
const ignoringDomains = ['mygo1.com', 'go1.com'];

(function () {
  const shouldIgnore = _.some(ignoringDomains, (domain) => window.location.href.indexOf(domain) > -1);

  if (shouldIgnore) {
    console.log('ignoring go1 extension');
    return;
  }

  $('head').append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />');

  Go1ExtensionInjectionArea.initialize();

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.name === commandKeys.checkQuickButtonSettings) {
      Go1ExtensionInjectionArea.toggleQuickButton();
      sendResponse({success: true});
      return true;
    }

    if (msg.name === commandKeys.checkCreateNoteSettings) {
      Go1ExtensionInjectionArea.toggleCreateNote();
      sendResponse({success: true});
      return true;
    }

    sendResponse({success: false, message: 'No action handler found'});
    return false;
  });
})();
