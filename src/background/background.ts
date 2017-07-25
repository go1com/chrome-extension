import firebase from 'firebase';
import {environment} from '../environments/environment';
import {StorageService} from "../modules/go1core/services/StorageService";

const storageService = new StorageService();

firebase.initializeApp(environment.firebase);

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if ((msg.from === 'content') && (msg.action === 'checkQuickButtonSetting')) {
    checkQuickButtonSetting(sendResponse);
  }

  if (msg.from == 'popup' && msg.action === 'quickButtonSettingChanged') {
    checkQuickButtonSetting(null);
  }
});

function checkQuickButtonSetting(sendResponse) {
  const quickButtonSetting = storageService.retrieve(environment.constants.localStorageKeys.quickButtonSetting) || false;
  if (sendResponse) {
    sendResponse(quickButtonSetting);
  }
  else {
    chrome.runtime.sendMessage({
      quickButtonSettingChanged: {
        newValue: quickButtonSetting
      },
      from: 'background'
    });
  }

}
