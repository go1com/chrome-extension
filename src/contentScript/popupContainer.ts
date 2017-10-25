import {IStorageService, IStorageServiceSymbol} from "../services/storageService/IStorageService";
import {inject, injectable} from "inversify";

@injectable()
export class PopupContainer {
  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService) {

  }

  initialize() {
    console.log('initializing popup container', this.storageService);
  }
}
