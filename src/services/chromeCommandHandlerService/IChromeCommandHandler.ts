export const IChromeCommandHandlerSymbol = Symbol("IChromeCommandHandler");
export interface IChromeCommandHandler {
  command: string;

  handle(request: any, sender: any, sendResponse: Function);
}
