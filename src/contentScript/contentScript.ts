import {Go1ExtensionInjectionArea} from "./go1ExtensionInjectionArea";
import {commandKeys} from "../commandHandlers/commandKeys";

const chromeExtId = chrome.runtime.id;
declare const $: any;

$('head').append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />')

Go1ExtensionInjectionArea.initialize();

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.name === commandKeys.checkQuickButtonSettings) {
    Go1ExtensionInjectionArea.toggleQuickButton();
    sendResponse({success: true});
    return true;
  }

  sendResponse({success: false, message: 'No action handler found'});
  return false;
});
