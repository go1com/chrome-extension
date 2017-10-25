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

  exists(key: string): boolean {
    return !!this.localStorage.getItem(key);
  }

  retrieve(key: string) {
    const result = this.localStorage.getItem(key);
    if (result === undefined || result == null) {
      return null;
    }

    try {
      const output = JSON.parse(result);
      return output;
    } catch (e) {
      return result;
    }
  }

  store(key: string, value: any) {
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    this.localStorage.removeItem(key);
  }

  clear() {
    this.localStorage.clear();
  }
}
