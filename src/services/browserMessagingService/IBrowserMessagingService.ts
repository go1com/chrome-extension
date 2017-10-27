export const IBrowserMessagingServiceSymbol = Symbol("IBrowserMessagingService");

export interface IBrowserMessagingService {
  requestToTab(tabId: number, command: string, data?: any): Promise<any>;

  requestToAllTabs(command: string, data?: any): Promise<any>;

  requestToBackground(command: string, data?: any): Promise<any> ;
}
