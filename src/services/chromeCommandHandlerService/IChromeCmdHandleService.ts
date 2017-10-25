import {IChromeCommandHandler} from "./IChromeCommandHandler";

export const IChromeCmdHandleServiceSymbol = Symbol("IChromeCmdHandleService");

export interface IChromeCmdHandleService {
  registerHandler(handler: IChromeCommandHandler): void;

  hasHandler(command: string): boolean ;

  handleCommand(command: string, request: any, sender: any, sendResponse: Function): void;
}
