import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {inject, injectable} from "inversify";
import {InjectionAreaComponent} from "../components/injectionAreaComponent/injectionAreaComponent";
import Util from "../../libs/annotation-plugin/util";
import {
  IBrowserMessagingService,
  IBrowserMessagingServiceSymbol
} from "../../services/browserMessagingService/IBrowserMessagingService";
import {PopupContainer} from "../components/popupContainerComponent/popupContainer";

@injectable()
export class StartDiscussionFromContextMenuCommandHandler implements ICommandHandler {
  command = commandKeys.startDiscussion;

  constructor(@inject(InjectionAreaComponent) private injectionAreaComponent: InjectionAreaComponent,
              @inject(PopupContainer) private popupContainer: PopupContainer,
              @inject(IBrowserMessagingServiceSymbol) private browserMessagingService: IBrowserMessagingService) {
  }


  async handle(request: any, sender: any, sendResponse: Function) {
    const selection = window.getSelection();
    const selectedText = selection && selection.toString();

    if (selectedText) {
      const xpathFromNode = Util.xpathFromNode($(selection.anchorNode.parentNode));

      await this.browserMessagingService.requestToBackground(commandKeys.startDiscussion, {
        quotation: selectedText,
        quotationPosition: xpathFromNode[0]
      });
    }

    this.popupContainer.showPopup('discussionsList/newDiscussion');
  }
}
