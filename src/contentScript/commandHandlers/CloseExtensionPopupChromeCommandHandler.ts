import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {Go1ExtensionInjectionArea} from "../go1ExtensionInjectionArea";
import {injectable} from "inversify";

declare const $: any;

@injectable()
export class CloseExtensionPopupChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.closeExtensionPopup;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    Go1ExtensionInjectionArea.singleInstance.closePopup();
  }
}
