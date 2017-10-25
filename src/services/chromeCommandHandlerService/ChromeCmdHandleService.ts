import {IChromeCommandHandler, IChromeCommandHandlerSymbol} from "./IChromeCommandHandler";
import {injectable, multiInject} from "inversify";

@injectable()
export class ChromeCmdHandleService {
  constructor(@multiInject(IChromeCommandHandlerSymbol) private handlers: IChromeCommandHandler[]) {
  }

  registerHandler(handler: IChromeCommandHandler) {
    if (this.handlers.indexOf(handler) >= 0) {
      throw new Error(`You already register the handler ${typeof handler}`)
    }

    this.handlers.push(handler);
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
