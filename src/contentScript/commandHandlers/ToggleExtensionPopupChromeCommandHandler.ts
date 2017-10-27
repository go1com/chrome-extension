import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {inject, injectable} from "inversify";
import {PopupContainer} from "../components/popupContainerComponent/popupContainer";

declare const $: any;

@injectable()
export class ToggleExtensionPopupChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.toggleExtensionPopup;

  constructor(@inject(PopupContainer) private popupContainer: PopupContainer) {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    this.popupContainer.togglePopup();
  }
}
