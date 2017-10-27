export const ICommandHandlerServiceSymbol = Symbol("ICommandHandlerService");

export interface ICommandHandlerService {
  hasHandler(command: string): boolean ;

  handleCommand(command: string, request: any, sender: any, sendResponse: Function): void;
}
