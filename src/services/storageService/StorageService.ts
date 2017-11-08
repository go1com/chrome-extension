import {injectable} from "inversify";
import {IStorageService} from "./IStorageService";

@injectable()
export class DefaultStorageService implements IStorageService {
  private localStorage: Storage;

  constructor() {
    if (!window.localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
  }

  exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(!!this.localStorage.getItem(key));
    });
  }

  retrieve(key: string): Promise<any> {
    const result = this.localStorage.getItem(key);
    if (result === undefined || result == null) {
      return Promise.resolve(null);
    }

    try {
      const output = JSON.parse(result);
      return Promise.resolve(output);
    } catch (e) {
      return Promise.resolve(result);
    }
  }

  store(key: string, value: any): Promise<any> {
    this.localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }

  remove(key: string): Promise<any> {
    this.localStorage.removeItem(key);
    return Promise.resolve();
  }

  clear(): Promise<any> {
    this.localStorage.clear();
    return Promise.resolve();
  }
}
