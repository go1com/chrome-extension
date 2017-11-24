import { ICommandHandler } from "../../services/commandHandlerService/ICommandHandler";
import { commandKeys } from "../../environments/commandKeys";
import { highlightClassName, HighlightService } from "../services/highlightService";
import { inject, injectable } from "inversify";
import { InjectionAreaComponent } from "../components/injectionAreaComponent/injectionAreaComponent";
import { JumpToQuoteTextCommandHandler } from "./jumpToQuoteTextChromeCommandHandler";

declare const $: any;

@injectable()
export class RemoveAllHighlightCommandHandler implements ICommandHandler {
  command = commandKeys.removeAllHighlight;

  constructor(@inject(InjectionAreaComponent) private injectionArea: InjectionAreaComponent,
    @inject(HighlightService) private highlightService: HighlightService) {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    console.log(`removing highlight for dom ${JumpToQuoteTextCommandHandler.quotations[`${request.data.id}`]}`);

    const existingDom = JumpToQuoteTextCommandHandler.quotations[`${request.data.id}`];

    if ($(existingDom).hasClass(highlightClassName)) {
      $(existingDom).removeClass(highlightClassName);
    }
    //
    // // remove old highlights
    // this.highlightService.unhighlight();
    //
    // this.injectionArea.checkNotesOnCurrentPage();

    if (sendResponse) {
      sendResponse({ success: true });
    }
  }
}
