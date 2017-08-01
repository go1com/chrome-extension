
export interface IChromeCommandHandler {
  command: string;

  handle(request: any, sender: any, sendResponse: Function);
}
