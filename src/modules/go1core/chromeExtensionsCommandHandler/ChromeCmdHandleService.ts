import {Injectable} from "@angular/core";
import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {Router} from "@angular/router";

@Injectable()
export class ChromeCmdHandleService {
  handlers: IChromeCommandHandler[];
  private router: Router;

  constructor() {
    this.handlers = [];
  }

  registerRouter(router: Router) {
    this.router = router;
  }

  registerHandler(handler: IChromeCommandHandler) {
    if (!this.router) {
      throw new Error(`You need to call registerRouter() before you can register handler`);
    }

    if (this.handlers.indexOf(handler) >= 0) {
      throw new Error(`You already register the handler ${typeof handler}`)
    }

    handler.setRouter(this.router);
    this.handlers.push(handler);
  }

  handleCommand(command: string, request: any, sender: any, sendResponse: Function) {
    const handler = this.handlers.find(h => h.command === command);
    if (handler == null) {
      return;
    }

    handler.handle(request, sender, sendResponse);
  }
}
