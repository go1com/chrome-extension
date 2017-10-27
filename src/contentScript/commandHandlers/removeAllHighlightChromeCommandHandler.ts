import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {HighlightService} from "../services/highlightService";
import {inject, injectable} from "inversify";
import {InjectionAreaComponent} from "../components/injectionAreaComponent/injectionAreaComponent";

declare const $: any;

@injectable()
export class RemoveAllHighlightChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.removeAllHighlight;

  constructor(@inject(InjectionAreaComponent) private injectionArea: InjectionAreaComponent) {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    // remove old highlights
    HighlightService.unhighlight();

    this.injectionArea.checkNotesOnCurrentPage();

    if (sendResponse) {
      sendResponse({success: true});
    }
  }
}
