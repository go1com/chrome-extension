import {injectable} from "inversify";
import {IStorageService} from "./IStorageService";

@injectable()
export class ChromeLocalStorageService implements IStorageService {
  localStorage: chrome.storage.LocalStorageArea;

  constructor() {
    if (!chrome.storage.local) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = chrome.storage.local;
  }

  exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.localStorage.get(key, result => {
        resolve(!!result[key]);
      });
    });
  }

  retrieve(key: string): Promise<any> {

    return new Promise((resolve, reject) => {
      this.localStorage.get(key, (result: any) => {
        if (result === undefined || result == null) {
          resolve(null);
        }

        try {
          const output = JSON.parse(result[key]);
          resolve(output);
        } catch (e) {
          resolve(result[key]);
        }
      });
    });

  }

  store(key: string, value: any): Promise<any> {
    const obj: any = {};
    obj[key] = value;

    return new Promise((resolve, reject) => {
      this.localStorage.set(obj, () => {
        resolve();
      });
    });
  }

  remove(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.localStorage.remove(key, () => {
        resolve();
      });
    });
  }

  clear(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.localStorage.clear(() => {
        resolve();
      });
    });
  }
}
