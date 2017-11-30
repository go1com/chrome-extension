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
    const annotationSerializedData = this.injectionAreaComponent.currentAnnotation;

    if (annotationSerializedData) {
      const selectingText = annotationSerializedData.quote;
      const quotationPosition = JSON.stringify(annotationSerializedData.ranges);

      await this.browserMessagingService.requestToBackground(commandKeys.startDiscussion, {
        quotation: selectingText,
        quotationPosition: quotationPosition
      });
    }

    this.popupContainer.showPopup('discussionsList/newDiscussion');
  }
}
