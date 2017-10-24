import {IChromeCommandHandler} from "../../commandHandlers/IChromeCommandHandler";
import {commandKeys} from "../../commandHandlers/commandKeys";
import {Go1ExtensionInjectionArea} from "../go1ExtensionInjectionArea";

declare const $: any;

export class ShowExtensionPopupChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.showExtensionPopup;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    Go1ExtensionInjectionArea.singleInstance.showPopup();
  }
}
