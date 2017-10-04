import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {StorageService} from "../modules/go1core/services/StorageService";
import {RestClientService} from "../modules/go1core/services/RestClientService";
import {commandKeys} from "./commandKeys";
import {DiscussionNoFirebaseServiceService} from "../modules/discussions/services/discussionNoFirebase.service";

export class LoadNotesForPageChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.loadNotesForPage;

  private restClientService: RestClientService;
  private storageService: StorageService;
  private discussionService: DiscussionNoFirebaseServiceService;

  constructor() {
    this.storageService = new StorageService();
    this.restClientService = new RestClientService();
    this.discussionService = new DiscussionNoFirebaseServiceService(this.restClientService, this.storageService);
  }

  handle(request: any, sender: any, sendResponse: Function) {
    this.discussionService.getUserNotesFromService(request.contextUrl)
      .then(notes => {
        sendResponse({
          success: true,
          data: notes
        });
      });
  }
}
