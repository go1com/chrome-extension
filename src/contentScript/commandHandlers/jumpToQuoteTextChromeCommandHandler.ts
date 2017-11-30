import { commandKeys } from "../../environments/commandKeys";
import { highlightClassName, HighlightService } from "../services/highlightService";
import { inject, injectable } from "inversify";
import { ICommandHandler } from "../../services/commandHandlerService/ICommandHandler";
import { InjectionAreaComponent } from "../components/injectionAreaComponent/injectionAreaComponent";

declare const $: any;

@injectable()
export class JumpToQuoteTextCommandHandler implements ICommandHandler {
  static quotations = {};
  command = commandKeys.jumpToQuotedText;

  constructor(@inject(InjectionAreaComponent) private injectionAreaComponent: InjectionAreaComponent,) {
  }

  async handle(request: any, sender: any, sendResponse?: Function) {
    if (request.data.quotation && request.data.quotationPosition) {
      try {
        const quotation = {
          quote: request.data.quotation,
          ranges: JSON.parse(request.data.quotationPosition)
        };

        const highlightedDOMs = this.injectionAreaComponent.highlighter.draw(quotation);

        if (!JumpToQuoteTextCommandHandler.quotations[`${request.data.id}`]) {
          JumpToQuoteTextCommandHandler.quotations[`${request.data.id}`] = quotation;
        }

        console.log(JumpToQuoteTextCommandHandler.quotations[`${request.data.id}`]);

        $('html, body').animate({
                                  scrollTop: $(highlightedDOMs[0]).offset().top - 75
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
