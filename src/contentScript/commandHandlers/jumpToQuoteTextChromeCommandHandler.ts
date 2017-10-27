import {commandKeys} from "../../environments/commandKeys";
import {HighlightService} from "../services/highlightService";
import {inject, injectable} from "inversify";
import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";

declare const $: any;

@injectable()
export class JumpToQuoteTextCommandHandler implements ICommandHandler {
  command = commandKeys.jumpToQuotedText;

  constructor(@inject(HighlightService) private highlightService: HighlightService) {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    if (request.data.quotation && request.data.quotationPosition) {
      this.highlightService.highlight(request.data.quotation, request.data.quotationPosition)
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
