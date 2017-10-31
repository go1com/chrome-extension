import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {inject, injectable} from "inversify";
import {PopupContainer} from "../components/popupContainerComponent/popupContainer";

@injectable()
export class AddToPortalFromContextMenuCommandHandler implements ICommandHandler {
  command = commandKeys.addToPortal;

  constructor(@inject(PopupContainer) private popupContainer: PopupContainer) {
  }


  async handle(request: any, sender: any, sendResponse: Function) {
    this.popupContainer.showPopup('addToPortal/addToPortal');
  }
}
