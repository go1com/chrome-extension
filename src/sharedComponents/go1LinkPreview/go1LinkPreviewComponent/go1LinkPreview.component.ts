import {Component, Input} from "@angular/core";
import {LinkPreview} from "../../../modules/linkPreviewer/linkPreviewService";
import {commandKeys} from "../../../commandHandlers/commandKeys";

@Component({
  selector: 'go1-link-preview',
  templateUrl: './go1LinkPreview.component.pug'
})
export class Go1LinkPreviewComponent {
  @Input('linkUrl') linkUrl: any;

  linkPreview: any = {};

  isLoading = false;

  constructor() {

  }

  async ngAfterViewInit() {
    await this.loadLinkPreviewData();
  }

  public async loadLinkPreviewData() {
    this.isLoading = true;

    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: commandKeys.getLinkPreview,
        data: this.linkUrl
      }, (response) => {
        debugger;
        this.linkPreview = response.data;
        this.isLoading = false;
        resolve();
      });
    });
  }
}
