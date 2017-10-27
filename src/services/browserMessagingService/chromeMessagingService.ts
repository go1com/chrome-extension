import {injectable} from "inversify";

@injectable()
export class ChromeMessagingService {
  requestToTab(tabId: number, command: string, data: any = null): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, {
        action: command,
        data
      }, response => {
        resolve(response);
      });
    });
  }

  requestToAllTabs(command: string, data: any = null): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({currentWindow: true}, tabs => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action: command,
            data
          }, response => {
            resolve(response);
          });
        });
      });
    });
  }

  requestToBackground(command: string, data: any = null): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: command,
        data
      }, response => {
        resolve(response);
      });
    });
  }
}
