import {IChromeCommandHandler} from "../../commandHandlers/IChromeCommandHandler";
import {commandKeys} from "../../commandHandlers/commandKeys";
import {HighlightService} from "../services/highlightService";
import {LinkPreview} from "../../modules/linkPreviewer/linkPreviewService";
import configuration from "../../environments/configuration";
import {Go1ExtensionInjectionArea} from "../go1ExtensionInjectionArea";

declare const $: any;

export class CloseExtensionPopupChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.closeExtensionPopup;

  constructor() {
  }

  handle(request: any, sender: any, sendResponse?: Function) {
    Go1ExtensionInjectionArea.singleInstance.closePopup();
  }
}
