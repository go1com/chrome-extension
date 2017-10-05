import {IChromeCommandHandler} from "../../commandHandlers/IChromeCommandHandler";
import {commandKeys} from "../../commandHandlers/commandKeys";
import {Go1ExtensionInjectionArea} from "../go1ExtensionInjectionArea";
import {HighlightService} from "../services/highlightService";

declare const $: any;

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
