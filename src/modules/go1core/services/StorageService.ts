import {Injectable} from "@angular/core";

@Injectable()
export class StorageService {
  private localStorage: Storage;

  constructor() {
    if (!localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
  }

  retrieve(key: string) {
    let result = this.localStorage.getItem(key);
    if (result == undefined || result == null)
      return null;

    try {
      let output = JSON.parse(result);
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
