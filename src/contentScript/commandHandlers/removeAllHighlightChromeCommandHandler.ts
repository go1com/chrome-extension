import {IChromeCommandHandler} from "../../commandHandlers/IChromeCommandHandler";
import {commandKeys} from "../../commandHandlers/commandKeys";
import Util from "../../libs/annotation-plugin/util";

declare const $: any;

export class RemoveAllHighlightChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.removeAllHighlight;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    // remove old highlights
    $('.go1-annotation-highlight').parent().unhighlight({
      className: 'go1-annotation-highlight'
    });

    if (sendResponse) {
      sendResponse({success: true});
    }
  }
}
