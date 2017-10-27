import {ICommandHandler} from "../../services/commandHandlerService/ICommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {inject, injectable} from "inversify";
import {InjectionAreaComponent} from "../components/injectionAreaComponent/injectionAreaComponent";

@injectable()
export class CheckHighlightSettingCommandHandler implements ICommandHandler {
  command = commandKeys.checkHighlightNoteSettings;

  constructor(@inject(InjectionAreaComponent) private injectionAreaComponent: InjectionAreaComponent) {
  }


  async handle(request: any, sender: any, sendResponse: Function) {
    await this.injectionAreaComponent.checkShowHighlightSettings();
  }
}
