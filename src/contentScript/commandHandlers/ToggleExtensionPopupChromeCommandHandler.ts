import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {Go1ExtensionInjectionArea} from "../go1ExtensionInjectionArea";
import {injectable} from "inversify";

declare const $: any;

@injectable()
export class ToggleExtensionPopupChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.toggleExtensionPopup;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    Go1ExtensionInjectionArea.singleInstance.togglePopup();
  }
}
