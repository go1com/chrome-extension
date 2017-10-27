import {IChromeCommandHandler} from "../../services/chromeCommandHandlerService/IChromeCommandHandler";
import {commandKeys} from "../../environments/commandKeys";
import {inject, injectable} from "inversify";
import {InjectionAreaComponent} from "../components/injectionAreaComponent/injectionAreaComponent";

@injectable()
export class CheckCreateNoteSettingChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.checkCreateNoteSettings;

  constructor(@inject(InjectionAreaComponent) private injectionAreaComponent: InjectionAreaComponent) {
  }


  async handle(request: any, sender: any, sendResponse: Function) {
    await this.injectionAreaComponent.checkCreateNoteSettings();
  }
}
