import {injectable} from "inversify";
import {IContentScriptComponent} from "../IContentScriptComponent";

declare const $: any;

@injectable()
export class DocumentComponent implements IContentScriptComponent {
  view: any;

  constructor() {
    this.view = $('body');
  }

  initialize(parentComponent: IContentScriptComponent) {
  }
}
