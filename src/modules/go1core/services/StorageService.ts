import {Injectable} from "@angular/core";
// import {DefaultStorageService} from "../../../services/storageService/StorageService";
import {ChromeLocalStorageService} from "../../../services/storageService/ChromeLocalStorageService";

@Injectable()
export class StorageService extends ChromeLocalStorageService {
  constructor() {
    super();
  }
}
