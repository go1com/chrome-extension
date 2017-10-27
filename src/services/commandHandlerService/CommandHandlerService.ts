import {injectable, multiInject} from "inversify";
import {ICommandHandlerService} from "./ICommandHandlerService";
import {ICommandHandler, ICommandHandlerSymbol} from "./ICommandHandler";

@injectable()
export class CommandHandlerService implements ICommandHandlerService {
  constructor(@multiInject(ICommandHandlerSymbol) private handlers: ICommandHandler[]) {
  }

  hasHandler(command: string) {
    const handler = this.handlers.find(h => h.command === command);
    return !!handler;
  }

  handleCommand(command: string, request: any, sender: any, sendResponse: Function) {
    const handler = this.handlers.find(h => h.command === command);
    if (!handler) {
      return;
    }

    handler.handle(request, sender, sendResponse);
  }
}
