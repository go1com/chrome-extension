import {IChromeCommandHandler} from "./IChromeCommandHandler";
import {commandKeys} from "./commandKeys";
import {LinkPreview} from "../modules/linkPreviewer/linkPreviewService";

export class GetLinkPreviewChromeCommandHandler implements IChromeCommandHandler {
  command = commandKeys.getLinkPreview;

  private linkPreviewer: LinkPreview;

  constructor() {
    this.linkPreviewer = new LinkPreview();
  }

  handle(request: any, sender: any, sendResponse: Function) {
    this.linkPreviewer.getPreview(request.data)
      .then((response: any) => {
        chrome.tabs.captureVisibleTab(null, {}, function (image) {
          response.image = image;
          sendResponse({
            success: true,
            data: response
          });
        });
      });
  }
}
