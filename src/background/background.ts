import {StorageService} from "../modules/go1core/services/StorageService";
import {DiscussionService} from "../modules/discussions/services/discussion.service";
import {RestClientService} from "../modules/go1core/services/RestClientService";
import configuration from "../environments/configuration";

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  const restClientService = new RestClientService();
  const storageService = new StorageService();

  if (msg.action === 'checkQuickButtonSetting') {
    checkQuickButtonSetting(storageService, sendResponse);
  }

  if (msg.action === 'addNewNote') {
    msg.data.user = storageService.retrieve(configuration.constants.localStorageKeys.user);
    msg.data.entityType = 'portal';
    msg.data.entityId = storageService.retrieve(configuration.constants.localStorageKeys.portalInstance);

    const discussionService = new DiscussionService(restClientService, storageService);
    discussionService.createNote(msg.data)
      .then((response) => {
        sendResponse({
          success: true
        });
      })
      .catch((error) => {
        sendResponse({
          success: false,
          error
        })
      });
    return true;
  }
});

function checkQuickButtonSetting(storageService, sendResponse) {
  const quickButtonSetting = storageService.retrieve(configuration.constants.localStorageKeys.quickButtonSetting) || false;
  if (sendResponse) {
    sendResponse(quickButtonSetting);
  }
}
