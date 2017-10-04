import {IChromeCommandHandler} from "../../commandHandlers/IChromeCommandHandler";
import {commandKeys} from "../../commandHandlers/commandKeys";
import {HighlightService} from "../services/highlightService";

declare const $: any;

export class JumpToQuoteTextChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.jumpToQuotedText;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    if (request.data.quotation && request.data.quotationPosition) {
      HighlightService.highlight(request.data.quotation, request.data.quotationPosition)
        .then(dom => {
          const scrollTo = $(dom);

          $('html, body').animate({
            scrollTop: scrollTo.offset().top - 75
          });​
        });
    }

    if (sendResponse) {
      sendResponse({success: true});
    }
  }
}
