export const ICommandHandlerSymbol = Symbol("ICommandHandler");
export interface ICommandHandler {
  command: string;

  handle(request: any, sender: any, sendResponse: Function);
}
