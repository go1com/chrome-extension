import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {DiscussionNoFirebaseServiceService} from "../../modules/discussions/services/discussionNoFirebase.service";
import {inject, injectable} from "inversify";

@injectable()
export class LoadNotesForPageChromeCommandHandler implements ICommandHandler {
  command = commandKeys.loadNotesForPage;

  constructor(@inject(DiscussionNoFirebaseServiceService) private discussionService: DiscussionNoFirebaseServiceService) {
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
