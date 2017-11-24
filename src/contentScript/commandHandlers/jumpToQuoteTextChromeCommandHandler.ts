import { commandKeys } from "../../environments/commandKeys";
import { highlightClassName, HighlightService } from "../services/highlightService";
import { inject, injectable } from "inversify";
import { ICommandHandler } from "../../services/commandHandlerService/ICommandHandler";

declare const $: any;

@injectable()
export class JumpToQuoteTextCommandHandler implements ICommandHandler {
  static quotations = {};
  command = commandKeys.jumpToQuotedText;

  constructor(@inject(HighlightService) private highlightService: HighlightService) {
  }

  async handle(request: any, sender: any, sendResponse?: Function) {
    if (request.data.quotation && request.data.quotationPosition) {
      try {
        let existingDom = JumpToQuoteTextCommandHandler.quotations[`${request.data.id}`];

        if (!existingDom) {
          const dom = await this.highlightService.highlight(request.data.quotation, request.data.quotationPosition, request.data.id);
          existingDom = $(dom);
          JumpToQuoteTextCommandHandler.quotations[`${request.data.id}`] = existingDom;
        }

        if (!$(existingDom).hasClass(highlightClassName)) {
          $(existingDom).addClass(highlightClassName);
        }

        $('html, body').animate({
          scrollTop: existingDom.offset().top - 75
        });​
      } catch (error) {
        console.error(error);
      }
    }

    if (sendResponse) {
      sendResponse({ success: true });
    }
  }
}
