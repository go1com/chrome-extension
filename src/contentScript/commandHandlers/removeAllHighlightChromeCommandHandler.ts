import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {HighlightService} from "../services/highlightService";
import {inject, injectable} from "inversify";
import {InjectionAreaComponent} from "../components/injectionAreaComponent/injectionAreaComponent";

declare const $: any;

@injectable()
export class RemoveAllHighlightCommandHandler implements ICommandHandler {
  command = commandKeys.removeAllHighlight;

  constructor(@inject(InjectionAreaComponent) private injectionArea: InjectionAreaComponent,
              @inject(HighlightService) private highlightService: HighlightService) {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    // remove old highlights
    this.highlightService.unhighlight();

    this.injectionArea.checkNotesOnCurrentPage();

    if (sendResponse) {
      sendResponse({success: true});
    }
  }
}
