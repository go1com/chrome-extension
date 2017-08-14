import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {StorageService} from "../modules/go1core/services/StorageService";
import {commandKeys} from "./commandKeys";
import configuration from "../environments/configuration";
import {DiscussionService} from "../modules/discussions/services/discussion.service";
import {RestClientService} from "../modules/go1core/services/RestClientService";

export class StartDiscussionChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.startDiscussion;

  private restClientService: RestClientService;
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
    this.restClientService = new RestClientService();
  }

  handle(request: any, sender: any, sendResponse: Function) {
    request.data.user = this.storageService.retrieve(configuration.constants.localStorageKeys.user);
    request.data.entityType = 'portal';

    const discussionService = new DiscussionService(this.restClientService, this.storageService);
    discussionService.createNote(request.data)
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
  }
}
