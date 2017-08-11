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
        const anchor = document.createElement('a');
        anchor.href = request.data;

        response.favicon = `${anchor.protocol}//${anchor.hostname}${anchor.port && anchor.port != '80' ? `:${anchor.port}` : ''}/favicon.ico`;
        response.hostname = anchor.hostname;

        if (response.images && response.images.length) {
          response.image = response.images[0];

          sendResponse({
            success: true,
            data: response
          });
          return;
        }

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
