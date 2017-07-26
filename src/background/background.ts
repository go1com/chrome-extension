import firebase from 'firebase';
import {environment} from '../environments/environment';
import {StorageService} from "../modules/go1core/services/StorageService";
import {DiscussionService} from "../modules/discussions/services/discussion.service";
import {RestClientService} from "../modules/go1core/services/RestClientService";

firebase.initializeApp(environment.firebase);

const restClientService = new RestClientService();
const storageService = new StorageService();
const discussionService = new DiscussionService(restClientService, storageService);

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if ((msg.from === 'content') && (msg.action === 'checkQuickButtonSetting')) {
    checkQuickButtonSetting(sendResponse);
  }

  if ((msg.from === 'content') && (msg.action === 'addNewNote')) {
    let currentUser = storageService.retrieve('user');
    msg.data.user = currentUser;
    msg.data.entityType = 'portal';
    msg.data.entityId = storageService.retrieve('activeInstance');

    discussionService.createNote(msg.data)
      .then(() => {
        sendResponse({
          success: true
        });
      });
    return true;
  }

  if (msg.from == 'popup' && msg.action === 'quickButtonSettingChanged') {
    checkQuickButtonSetting(null);
  }
});

function checkQuickButtonSetting(sendResponse) {
  const quickButtonSetting = storageService.retrieve(environment.constants.localStorageKeys.quickButtonSetting) || false;
  if (sendResponse) {
    sendResponse(quickButtonSetting);
  } else {
    chrome.runtime.sendMessage({
      quickButtonSettingChanged: {
        newValue: quickButtonSetting
      },
      from: 'background'
    });
  }
}
