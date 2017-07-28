import firebase from 'firebase';
import {environment} from '../environments';
import {StorageService} from "../modules/go1core/services/StorageService";
import {DiscussionService} from "../modules/discussions/services/discussion.service";
import {RestClientService} from "../modules/go1core/services/RestClientService";

firebase.initializeApp(environment.firebase);

const restClientService = new RestClientService();
const storageService = new StorageService();
const discussionService = new DiscussionService(restClientService, storageService);

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === 'checkQuickButtonSetting') {
    checkQuickButtonSetting(sendResponse);
  }

  if (msg.action === 'addNewNote') {
    msg.data.user = storageService.retrieve('user');
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
});

function checkQuickButtonSetting(sendResponse) {
  const quickButtonSetting = storageService.retrieve(environment.constants.localStorageKeys.quickButtonSetting) || false;
  if (sendResponse) {
    sendResponse(quickButtonSetting);
  }
}
