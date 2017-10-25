import {Injectable} from "@angular/core";
import {DefaultStorageService} from "../../../services/storageService/StorageService";

@Injectable()
export class StorageService extends DefaultStorageService {
  constructor() {
    super();
  }
}
