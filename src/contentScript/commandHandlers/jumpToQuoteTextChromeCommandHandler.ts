import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {HighlightService} from "../services/highlightService";
import {injectable} from "inversify";

declare const $: any;

@injectable()
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
