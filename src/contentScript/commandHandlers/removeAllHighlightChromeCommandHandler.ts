import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {Go1ExtensionInjectionArea} from "../go1ExtensionInjectionArea";
import {HighlightService} from "../services/highlightService";
import {injectable} from "inversify";

declare const $: any;

@injectable()
export class RemoveAllHighlightChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.removeAllHighlight;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    // remove old highlights
    HighlightService.unhighlight();

    Go1ExtensionInjectionArea.toggleHighlightArea();

    if (sendResponse) {
      sendResponse({success: true});
    }
  }
}
