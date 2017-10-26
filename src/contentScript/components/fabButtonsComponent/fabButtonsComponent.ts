import {IStorageService, IStorageServiceSymbol} from "../../../services/storageService/IStorageService";
import {inject, injectable} from "inversify";

declare const $: any;

@injectable()
export class FabButtonsComponent {
  private view: any;

  constructor(@inject(IStorageServiceSymbol) private storageService: IStorageService) {
    this.view = $(require('./fabButtons.pug'));
  }

  initialize() {

  }
}
